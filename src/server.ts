// src/main.server.ts
import { enableProdMode } from '@angular/core';
import { ngExpressEngine } from '@nguniversal/express-engine';
import express from 'express';
import { join } from 'path';
// import { AppServerModule } from './dist/rd_residency/server/main'; // Adjust the path accordingly

// enableDevMode();

const app = express();

const PORT = process.env['PORT'] || 4000;
const DIST_FOLDER = join( process.cwd(), 'dist/rd_residency/browser' ); // Adjust the path accordingly

// app.engine( 'html', ngExpressEngine( {
//   bootstrap: AppServerModule,
// } ) );

app.set( 'view engine', 'html' );
app.set( 'views', DIST_FOLDER );

app.get( '*.*', express.static( DIST_FOLDER, {
  maxAge: '1y'
} ) );

app.get( '*', ( req, res ) => {
  res.render( 'index', { req } );
} );

app.listen( PORT, () => {
  console.log( `Node server listening on http://localhost:${ PORT }` );
} );
