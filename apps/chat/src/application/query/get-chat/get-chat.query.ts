export class GetChatQuery {
  constructor(
    public readonly userId: string,
    public readonly chatId: string,
  ) {}
}
