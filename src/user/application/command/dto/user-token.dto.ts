import { IsEmail, IsUUID } from 'class-validator';

export class UserTokenDto {
  @IsUUID()
  userId;

  @IsEmail()
  email;
}
