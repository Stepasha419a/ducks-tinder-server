import { ChatIdDto } from 'chats/legacy/dto';
import { fullChatStub, messageStub } from '../stubs';

export const EDIT_MESSAGE_DTO = {
  messageId: messageStub().id,
  chatId: fullChatStub().id,
  text: 'update-text',
};

export const CHAT_ID_DTO: ChatIdDto = {
  chatId: fullChatStub().id,
};
