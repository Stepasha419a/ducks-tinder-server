export class GetChatMemberIdsQuery {
  constructor(public readonly userId: string, public readonly chatId: string) {}
}
