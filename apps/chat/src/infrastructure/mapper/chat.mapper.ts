import { Message } from 'apps/chat/src/domain';
import { ChatPaginationValueObject } from 'apps/chat/src/domain/value-object';
import {
  ShortChatPagination,
  ShortDataMessage,
  ShortMessage,
  ShortMessagesPagination,
} from './interface';
import {
  DataMessageView,
  MessagesPaginationView,
} from '../../application/views';

export class ChatMapper {
  getShortMessagesPagination(
    messagesPagination: MessagesPaginationView,
  ): ShortMessagesPagination {
    const messages = messagesPagination.messages.map((message) =>
      this.getShortDataMessage(message),
    );

    return { ...messagesPagination, messages };
  }

  getShortChatPagination(
    chatPagination: ChatPaginationValueObject,
  ): ShortChatPagination {
    const lastMessage = chatPagination.lastMessage
      ? this.getShortMessage(chatPagination.lastMessage)
      : null;

    return { ...chatPagination, lastMessage };
  }

  private getShortMessage(message: Message): ShortMessage {
    return {
      id: message.id,
      text: message.text,
      userId: message.userId,
      updatedAt: message.updatedAt,
      createdAt: message.createdAt,
    };
  }

  private getShortDataMessage(message: DataMessageView): ShortDataMessage {
    return {
      id: message.id,
      text: message.text,
      userId: message.userId,
      replied: message.replied,
      avatar: message.avatar,
      name: message.name,
      updatedAt: message.updatedAt,
      createdAt: message.createdAt,
    };
  }
}
