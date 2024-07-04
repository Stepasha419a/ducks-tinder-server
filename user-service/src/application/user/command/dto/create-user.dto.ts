import { IsString, IsUUID, Length } from 'class-validator';

export class CreateUserDto {
  @IsUUID()
  id: string;

  @IsString()
  @Length(2, 14)
  name: string;
}
