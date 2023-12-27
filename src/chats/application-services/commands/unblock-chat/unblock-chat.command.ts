export class UnblockChatCommand {
  constructor(public readonly userId: string, public readonly chatId: string) {}
}
