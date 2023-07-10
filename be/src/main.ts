import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

import { app as _app } from './app';

(async () => {
  const app = await _app();

  // swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Bridgit Technical Comptetence API')
    .setDescription(
      `This is the Swagger interface for the technical competence API.  You can use this to experiment with the API and learn about payloads and error messages for the API endpoints you will be integrating.`,
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, <SwaggerCustomOptions>{
    swaggerOptions: {
      plugins: {
        wrapComponents: {
          curl: () => () => null,
        },
      },
    },
  });

  const port = process.env.PORT || 8081;
  const host = process.env.HOST || 'localhost';

  // start server
  const server = await app.listen(port, host);
  server.keepAliveTimeout = 61 * 1000;
  server.headersTimeout = 62 * 1000;
})();
