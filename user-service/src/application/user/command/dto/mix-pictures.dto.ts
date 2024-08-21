import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNumber,
  Max,
  Min,
} from 'class-validator';

export class MixPicturesDto {
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(9)
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { each: true },
  )
  @Min(0, { each: true })
  @Max(8, { each: true })
  @Type(() => Number)
  pictureOrders: number[];
}
