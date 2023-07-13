import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ExpressAdapter } from '@nestjs/platform-express';

import { DTOValidationPipe } from './common/dto-validation.pipe';

import { HttpExceptionFilter } from './common/http-exception.filter';
import { IncomingMessage, ServerResponse } from 'http';
import { NestFactory } from '@nestjs/core';
import { RawBodyRequest, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

export const app = async (expressApp?: any) => {
  // app initialization
  const cors = <CorsOptions>{};
  const { CORS_ORIGINS = '' } = process.env;
  if (CORS_ORIGINS) {
    cors.origin = CORS_ORIGINS?.split(',');
    cors.credentials = true;
  }
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
    {
      cors,
      rawBody: true,
    },
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new DTOValidationPipe());
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true,
      transform: true,
    }),
  );
  app.use(helmet());
  const rawBodyBuffer = (
    req: IncomingMessage,
    _: ServerResponse,
    buffer: Buffer,
  ) => {
    if (buffer?.length) {
      (<RawBodyRequest<Request>>(<unknown>req)).rawBody = buffer;
    }
  };
  app.use(bodyParser.json({ verify: rawBodyBuffer, limit: '5mb' }));
  app.use(
    bodyParser.urlencoded({
      verify: rawBodyBuffer,
      limit: '5mb',
      extended: true,
    }),
  );

  return app;
};
