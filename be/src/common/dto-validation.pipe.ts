import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { Guid } from 'typescript-guid';
import { ValidationError, validate } from 'class-validator';
import { paramCase } from 'param-case';
import { plainToInstance } from 'class-transformer';

/**
 * Validation pipe for DTO transformations
 */
@Injectable()
export class DTOValidationPipe implements PipeTransform<any> {
  /**
   * Creates an object out of a metatype
   * @param value
   * @param param1
   * @returns
   */
  async transform(
    value: any,
    { metatype }: ArgumentMetadata,
  ): Promise<Record<string, unknown>> {
    if (!value || !Object.keys(value).length) {
      return;
    }
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new HttpException(
        this.formatErrors(errors),
        HttpStatus.BAD_REQUEST,
      );
    }
    return value;
  }
  /**
   * Validates a metatype converted to an object
   * @param metatype
   * @returns {boolean}
   */
  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Date, Object, Guid];
    return !types.includes(metatype);
  }

  /**
   * Formats error message(s) if an object did not validate
   * @param errors
   * @returns {string}
   */
  formatErrors(validationErrors: ValidationError[]): string | string[] {
    if (!validationErrors?.length) {
      return;
    }

    const errors = [];
    for (const error of validationErrors) {
      const property = paramCase(error.property);
      let errorMessages;
      const keys = Object.keys(error.target);

      console.log(error);

      if (error.children && error.children.length >= 1) {
        const childErrors = this.formatErrors(error.children);
        if (typeof childErrors === 'string') {
          errors.push(childErrors);
        } else {
          errors.push(...childErrors);
        }
      } else {
        errorMessages = Object.values(error.constraints);
        for (const errorMessage of errorMessages) {
          if (errors.indexOf(errorMessage) === -1) {
            errors.push(errorMessage);
          }
        }
      }
    }
    return errors.length === 1 ? errors[0] : errors;
  }
}
