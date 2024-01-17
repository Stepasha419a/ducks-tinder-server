import { IsEmail, MaxLength, IsString, Length } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @Length(2, 14)
  readonly name: string;

  @IsEmail()
  @MaxLength(50)
  readonly email: string;

  @IsString()
  @Length(6, 30)
  readonly password: string;
}
