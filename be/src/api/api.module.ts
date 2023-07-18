import { MailModule } from './mail/mail.module';
import { Module } from '@nestjs/common';
import { SubmitModule } from './submit/submit.module';

@Module({
  imports: [SubmitModule, MailModule],
})
export class APIModule {}
