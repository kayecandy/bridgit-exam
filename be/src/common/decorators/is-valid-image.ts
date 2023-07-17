import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

/**
 * Verify a base64 image is a valid JPG, PNG or GIF image
 */
export function IsValidImage(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidImage',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return (
            typeof value === 'string' &&
            (value.startsWith('data:image/jpeg') ||
              value.startsWith('data:image/png') ||
              value.startsWith('data:image/gif'))
          );
        },
      },
    });
  };
}
