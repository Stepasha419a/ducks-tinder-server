import { IsString, Length, IsUUID } from 'class-validator';

export class EditMessageDto {
  @IsUUID()
  messageId: string;

  @IsString()
  @Length(1, 800)
  text: string;
}
