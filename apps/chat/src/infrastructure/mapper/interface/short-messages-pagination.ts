import { ShortDataMessage } from './short-data-message';

export interface ShortMessagesPagination {
  chatId: string;
  messages: ShortDataMessage[];
}
