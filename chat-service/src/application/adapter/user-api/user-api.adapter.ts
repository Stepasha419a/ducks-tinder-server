import { ChatMemberView } from './view';

export abstract class UserApi {
  abstract getChatMemberView(memberId: string): Promise<ChatMemberView>;
}
