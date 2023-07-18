import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { readdir } from 'fs';

readdir(process.cwd() + '/be', { withFileTypes: true }, (err, files) => {
  console.log(files);
});

@Module({
  imports: [
    MailerModule.forRootAsync({
      // or
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('SMTP_HOST'),
          port: parseInt(config.get('SMTP_PORT') ?? '587'),
          secure: false,
          auth: {
            user: config.get('SMTP_USER'),
            pass: config.get('SMTP_PASS'),
          },
          tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false,
          },
        },
        defaults: {
          from: `"${config.get('SMTP_FROM_NAME')}" <${config.get(
            'SMTP_FROM_EMAIL',
          )}>`,
        },
        template: {
          dir: join(process.cwd(), 'be/dist/api/mail/templates'),
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService], // 👈 export for DI
})
export class MailModule {}
