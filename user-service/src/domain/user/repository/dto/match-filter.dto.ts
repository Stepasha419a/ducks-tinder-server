import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';

export class MatchFilterDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(3)
  @Type(() => Number)
  take = 1;

  @ValidateIf((value) => value !== undefined)
  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(2)
  @IsString({ each: true })
  @Type(() => String)
  @Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
  skipUserIds: string[] = [];
}
