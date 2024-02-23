import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(20)
  @Type(() => Number)
  take = 20;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  skip = 0;
}
