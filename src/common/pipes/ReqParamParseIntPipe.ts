import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ReqParamParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const { data } = metadata;
    const parsedValue = parseInt(value);

    if (isNaN(parsedValue) || parsedValue.toString() != value) {
      throw new BadRequestException(
        `Validation failed: Request Param <${data}> must be a number.You set ${data}=${value}`,
      );
    }

    return parsedValue;
  }
}
