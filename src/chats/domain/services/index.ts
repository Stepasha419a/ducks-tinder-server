import { AggregateRoot } from '@nestjs/cqrs';
import {
  GET_PRIMITIVE_FIELDS,
  GetPrimitiveFields,
} from './get-primitive-fields.case';
import { IsDefined } from 'class-validator';
import { BLOCK_CHAT, BlockChat } from './block-chat.case';
import { UNBLOCK_CHAT, UnblockChat } from './unblock-chat.case';

export class ChatServices
  extends AggregateRoot
  implements GetPrimitiveFields, BlockChat, UnblockChat
{
  @IsDefined()
  getPrimitiveFields = GET_PRIMITIVE_FIELDS;

  @IsDefined()
  blockChat = BLOCK_CHAT;

  @IsDefined()
  unblockChat = UNBLOCK_CHAT;
}
