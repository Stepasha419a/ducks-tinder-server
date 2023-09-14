import { IsNumber } from 'class-validator';

export class DeletePictureDto {
  @IsNumber()
  readonly order: number;
}
