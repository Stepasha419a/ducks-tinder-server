import { IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class SendMessageDto {
  @IsUUID()
  chatId: string;

  @IsString()
  @Length(1, 800)
  text: string;

  @IsOptional()
  @IsString()
  repliedId: string | null;
}
