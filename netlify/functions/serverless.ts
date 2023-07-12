import { app as _app } from '../../be/dist/app';

import serverlessExpress from '@vendia/serverless-express';
import express from 'express';
import { Handler } from '@netlify/functions';

let cachedServer: Handler;

async function bootstrap() {
  if (!cachedServer) {
    const expressApp = express();
    const nestApp = await _app(expressApp);
    nestApp.setGlobalPrefix('/.netlify/functions/serverless');

    await nestApp.init();

    cachedServer = serverlessExpress({
      app: expressApp,
      resolutionMode: 'CALLBACK',
    });
  }

  return cachedServer;
}

export const handler = async (event, context, callback) => {
  const server = await bootstrap();
  event.requestContext = {};

  return server(event, context, callback);
};
