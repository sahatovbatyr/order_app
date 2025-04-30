import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    console.log('value__', value);
    const { metatype, data } = metadata;
    console.log('ValidationPipe metadata', metadata);
    console.log('ValidationPipe data', data);

    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const messages = errors.map((err) => {
        if (err.constraints) {
          return `[${err.property}] - ${Object.values(err.constraints).join(', ')}`;
        }
      });
      throw new BadRequestException('Validation failed: ' + messages);
    }
    return value;
  }

  private toValidate(metatype: any): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
