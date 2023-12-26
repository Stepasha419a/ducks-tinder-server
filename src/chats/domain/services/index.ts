import { AggregateRoot } from '@nestjs/cqrs';
import {
  GET_PRIMITIVE_FIELDS,
  GetPrimitiveFields,
} from './get-primitive-fields.case';
import { IsDefined } from 'class-validator';
import { BLOCK_CHAT, BlockChat } from './block-chat.case';

export class ChatServices
  extends AggregateRoot
  implements GetPrimitiveFields, BlockChat
{
  @IsDefined()
  getPrimitiveFields = GET_PRIMITIVE_FIELDS;

  @IsDefined()
  blockChat = BLOCK_CHAT;
}
