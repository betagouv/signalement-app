import 'zone.js/dist/zone-node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import express from 'express';
import { join } from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';

import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync } from 'fs';
import { enableProdMode } from '@angular/core';

enableProdMode();
// The Express app is exported so that it can be used by serverless Functions.
export function app() {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  const oldHostname = 'signalconso.beta.gouv.fr';
  const newHostname = 'signal.conso.gouv.fr';

  server.use(compression());
  server.use(cors());
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true }));

  server.use(helmet({
    hsts: {
      maxAge: 15768000   // 6 months in seconds
    },
    frameguard: {
      action: 'deny'
    }
  }));

  if (process.env.API_BASE_URL) {
    server.use(function(req, res, next) {
      res.setHeader('Content-Security-Policy',
        `default-src 'self' stats.data.gouv.fr sentry.data.gouv.fr entreprise.data.gouv.fr ${process.env.API_BASE_URL} 'unsafe-inline';  \
       script-src 'self' stats.data.gouv.fr sentry.data.gouv.fr entreprise.data.gouv.fr 'sha256-WWHGLj0eoGsKPEGMnTqjS4sH0zDInMRPKN098NNWH4E='; \
       img-src 'self' *.data.gouv.fr data: *.numerique.gouv.fr; \
       frame-src 'self' stats.data.gouv.fr *.youtube-nocookie.com; \
       style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;`);
      return next();
    });
  }

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);


  server.all('*', (req, res, next) => {
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

  server.all('*', (req, res, next) => {
    if (req.hostname.indexOf(oldHostname) !== -1) {
      res.redirect('https://' + newHostname + req.url);
    } else {
      return next();
    }
  });

  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });

  return server;
}

function run() {
  const port = process.env.PORT || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
