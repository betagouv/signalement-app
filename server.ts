import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import { enableProdMode } from '@angular/core';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as compression from 'compression';
import * as helmet from 'helmet';
import { join } from 'path';


enableProdMode();

export const app = express();
const oldHostname = 'signalconso.beta.gouv.fr';
const newHostname = 'signal.conso.gouv.fr';

app.use(compression());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet({
  hsts: {
    maxAge: 15768000   // 6 months in seconds
  },
  frameguard: {
    action: 'deny'
  }
}));

if (process.env.API_BASE_URL) {
  app.use(function(req, res, next) {
    res.setHeader("Content-Security-Policy",
      `default-src 'self' stats.data.gouv.fr entreprise.data.gouv.fr ${process.env.API_BASE_URL} 'unsafe-inline';  \
       script-src 'self' stats.data.gouv.fr entreprise.data.gouv.fr 'sha256-WWHGLj0eoGsKPEGMnTqjS4sH0zDInMRPKN098NNWH4E='; \
       img-src 'self' *.data.gouv.fr data: *.numerique.gouv.fr; \
       frame-src 'self' *.youtube-nocookie.com;`);
    return next();
  });
}

const DIST_FOLDER = join(process.cwd(), 'dist');
const PORT = process.env.PORT || 8080;

const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main');

app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP),
  ],
}));

app.set('view engine', 'html');
app.set('views', './dist/browser');

app.all('*', (req, res, next) => {
  const xfp = req.get('X-Forwarded-Proto');
  if (xfp) {
    // protocol check, if http, redirect to https
    if (req.get('X-Forwarded-Proto').indexOf('https') !== -1) {
      return next();
    } else {
      res.redirect('https://' + newHostname + req.url);
    }
  } else {
    return next();
  }
});

app.all('*', (req, res, next) => {
  if (req.hostname.indexOf(oldHostname) !== -1) {
    res.redirect('https://' + newHostname + req.url);
  } else {
    return next();
  }
});


app.get('/redirect/**', (req, res) => {
  const location = req.url.substring(10);
  res.redirect(301, location);
});

app.get('*.*', express.static('./dist/browser', {
  maxAge: '1y',
}));

app.get('/*', (req, res) => {
  res.render('index', { req, res }, (err, html) => {
    if (html) {
      res.send(html);
    } else {
      console.error(err);
      res.send(err);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Node server listening on http://localhost:${PORT}`);
});
