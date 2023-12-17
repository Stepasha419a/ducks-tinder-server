import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray } from 'class-validator';

export class MixPicturesDto {
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(9)
  @Type(() => Number)
  pictureOrders: number[];
}
