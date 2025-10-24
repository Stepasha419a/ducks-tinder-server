export class BlockChatCommand {
  constructor(
    public readonly userId: string,
    public readonly chatId: string,
  ) {}
}
