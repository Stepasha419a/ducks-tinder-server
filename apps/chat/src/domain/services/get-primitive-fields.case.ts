import { Chat } from '../chat.interface';

export interface GetPrimitiveFields {
  getPrimitiveFields(): Promise<ChatPrimitiveFields>;
}

export async function GET_PRIMITIVE_FIELDS(
  this: Chat,
): Promise<ChatPrimitiveFields> {
  return {
    blocked: this.blocked,
    blockedById: this.blockedById,
  };
}

export interface ChatPrimitiveFields {
  blocked: boolean;
  blockedById?: string;
}
