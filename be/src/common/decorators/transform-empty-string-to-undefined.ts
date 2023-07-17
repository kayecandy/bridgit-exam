import { Transform, TransformOptions } from 'class-transformer';

export function TransformEmptyStringToUndefined(options?: TransformOptions) {
  return Transform((val) => {
    if (val.obj[val.key] === '') return undefined;

    return val.value;
  }, options);
}
