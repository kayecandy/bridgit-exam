import { MailModule } from 'src/mail/mail.module';
import { Module } from '@nestjs/common';
import { SubmitController } from './submit.controller';
import { SubmitService } from './submit.service';

@Module({
  imports: [MailModule],
  controllers: [SubmitController],
  providers: [SubmitService],
  exports: [SubmitService],
})
export class SubmitModule {}
