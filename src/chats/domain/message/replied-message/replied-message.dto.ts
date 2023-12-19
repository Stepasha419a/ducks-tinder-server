import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { RepliedMessage } from './replied-message.interface';

export class RepliedMessageDto implements RepliedMessage {
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsUUID()
  userId: string;

  @IsString()
  @IsNotEmpty()
  createdAt;

  @IsString()
  @IsNotEmpty()
  updatedAt;
}
