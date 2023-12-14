export class DislikeUserCommand {
  constructor(public readonly userId: string, public readonly pairId: string) {}
}
