export class SaveLastSeenCommand {
  constructor(public readonly userId: string, public readonly chatId: string) {}
}
