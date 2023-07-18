import { ApplicantDto } from 'src/api/submit/submit.dto';
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async send(applicantDto: ApplicantDto, isAccepted: boolean) {
    const applicantDetails = { ...applicantDto };
    applicantDetails.finances = undefined;

    const financeDetails = { ...applicantDto.finances };
    financeDetails.stock = undefined;

    const stockDetails = { ...applicantDto.finances.stock[0] };

    const licenseBase64 = applicantDetails.license;
    applicantDetails.license = undefined;

    await this.mailerService
      .sendMail({
        to: applicantDto.email,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: 'Your Bridgit application',
        template: './form', // `.hbs` extension is appended automatically
        attachments: [
          {
            content: licenseBase64,
            contentType: 'image/*',
            filename: 'license',
            cid: 'license',
            contentDisposition: 'inline',
          },
        ],
        context: {
          // ✏️ filling curly brackets with content
          firstName: applicantDto.firstName,
          lastName: applicantDto.lastName,
          applicantData: JSON.stringify(applicantDetails, undefined, 2)
            .replace(/,/g, '<br/>')
            .replace(/[{}]/g, ''),
          financeData: JSON.stringify(financeDetails, undefined, 2)
            .replace(',', '$1<br/>')
            .replace(/[{}]/g, ''),
          stockData: JSON.stringify(stockDetails, undefined, 2)
            .replace(',', '$1<br/>')
            .replace(/[{}]/g, ''),
          acceptanceText: isAccepted
            ? 'Your request has been approved!'
            : 'Sorry, this request has not been approved',
        },
      })
      .then((e) => {
        console.log('Email sent!');
      })
      .catch((err) => {
        console.log('Email error', err);
      });
  }
}
