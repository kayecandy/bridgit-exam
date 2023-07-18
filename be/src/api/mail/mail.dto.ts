import { ApiProperty } from '@nestjs/swagger';
import { ApplicantDto } from '../submit/submit.dto';
import {
  IsBoolean,
  IsNotEmpty,
  IsNotEmptyObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class MailDto {
  @ApiProperty({
    description: 'The payload data for an applicant',
  })
  @IsNotEmpty()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => ApplicantDto)
  applicant: ApplicantDto;

  @ApiProperty({
    description:
      'Whether the applicant is eligible for a loan or not. See SubmitService.determineEligibility',
  })
  @IsBoolean()
  @IsNotEmpty()
  approved: boolean;
}
