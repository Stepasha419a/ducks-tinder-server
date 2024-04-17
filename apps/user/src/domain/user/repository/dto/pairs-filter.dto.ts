import { PaginationDto } from '@app/common/shared/dto';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class PairsFilterDto extends PaginationDto {
  @IsOptional()
  @Min(2)
  @Max(100)
  @Transform(({ value }) => {
    return Number(value);
  })
  distance: number = 100;

  @IsOptional()
  @Min(18)
  @Max(97)
  @Transform(({ value }) => {
    return Number(value);
  })
  ageFrom: number = 18;

  @IsOptional()
  @Min(21)
  @Max(100)
  @Transform(({ value }) => {
    return Number(value);
  })
  ageTo: number = 100;

  @IsOptional()
  @Min(0)
  @Max(9)
  @Transform(({ value }) => {
    return Number(value);
  })
  pictures: number = 0;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  @Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
  interests: string[] = [];

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    return Boolean(value);
  })
  hasInterests: boolean = false;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    return Boolean(value);
  })
  identifyConfirmed: boolean = false;
}
