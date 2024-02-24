import { DataMessageView } from 'apps/chat/src/application/views';

export type ShortDataMessage = Omit<DataMessageView, 'chatId'>;
