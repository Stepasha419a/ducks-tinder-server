import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { COMMON_ERROR } from 'src/application/common';

@Injectable()
export class OptionalValidationPipe implements PipeTransform {
  transform(value: unknown) {
    if (Object.keys(value).length < 1) {
      throw new BadRequestException(COMMON_ERROR.NOTHING_PASSED);
    }
    return value;
  }
}
