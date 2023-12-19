import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(20)
  take = 20;

  @IsOptional()
  @IsNumber()
  @Min(0)
  skip = 0;
}
