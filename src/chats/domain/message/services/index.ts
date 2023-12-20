import { AggregateRoot } from '@nestjs/cqrs';
import { GET_CHAT_MESSAGE, GetChatMessage } from './get-chat-message.case';
import { IsDefined } from 'class-validator';

export class MessageServices extends AggregateRoot implements GetChatMessage {
  @IsDefined()
  getChatMessage = GET_CHAT_MESSAGE;
}
