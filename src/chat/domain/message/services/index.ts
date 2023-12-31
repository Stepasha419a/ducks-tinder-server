import { AggregateRoot } from '@nestjs/cqrs';
import { GET_CHAT_MESSAGE, GetChatMessage } from './get-chat-message.case';
import { IsDefined } from 'class-validator';
import { SET_TEXT, SetText } from './set-text.case';

export class MessageServices
  extends AggregateRoot
  implements GetChatMessage, SetText
{
  @IsDefined()
  getChatMessage = GET_CHAT_MESSAGE;

  @IsDefined()
  setText = SET_TEXT;
}
