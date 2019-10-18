import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import { enableProdMode } from '@angular/core';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as compression from 'compression';
import * as hsts from 'hsts';
import { join } from 'path';

enableProdMode();

export const app = express();

app.use(compression());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setup Strict-Transport-Security: max-age: 15552000; includeSubDomains
app.use(hsts({
  maxAge: 15552000  // 180 days in seconds
}));

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
    if(req.get('X-Forwarded-Proto').indexOf('https') !== -1) {
      return next();
    } else {
      res.redirect('https://' + req.hostname + req.url);
    }
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
