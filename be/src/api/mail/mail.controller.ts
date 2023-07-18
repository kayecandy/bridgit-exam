import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { MailDto } from './mail.dto';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post()
  @ApiTags('API Endpoints')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Send email copy of applicant's form answers",
    description:
      "Sends an email to applicant of the form answers and whether or not applicant's application was successful. Created on a separate API for support of Netlify functions",
  })
  @ApiBody({
    type: MailDto,
  })
  async mail(@Body() { applicant, approved }: MailDto) {
    await this.mailService.send(applicant, approved);
  }
}
