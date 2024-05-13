export class DeleteMessageCommand {
  constructor(
    public readonly userId: string,
    public readonly messageId: string,
  ) {}
}
