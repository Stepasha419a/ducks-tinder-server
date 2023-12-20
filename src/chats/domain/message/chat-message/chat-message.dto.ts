import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { RepliedMessage, RepliedMessageDto } from '../replied-message';
import { Type } from 'class-transformer';
import { ChatMessage } from './chat-message.interface';

export class ChatMessageDto implements ChatMessage {
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsUUID()
  userId: string;

  @IsOptional()
  @IsNotEmptyObject()
  @Type(() => RepliedMessageDto)
  repliedId?: RepliedMessage;

  @IsString()
  @IsNotEmpty()
  createdAt;

  @IsString()
  @IsNotEmpty()
  updatedAt;
}
