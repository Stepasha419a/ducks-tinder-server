import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { COMMON_ERROR } from '@app/common/shared/constant';

@Injectable()
export class OptionalValidationPipe implements PipeTransform {
  transform(value: unknown) {
    if (Object.keys(value).length < 1) {
      throw new BadRequestException(COMMON_ERROR.NOTHING_PASSED);
    }
    return value;
  }
}
