export class DeleteChatCommand {
  constructor(public readonly userId: string, public readonly chatId: string) {}
}
