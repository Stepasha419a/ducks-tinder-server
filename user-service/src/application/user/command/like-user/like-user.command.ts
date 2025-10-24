export class LikeUserCommand {
  constructor(
    public readonly userId: string,
    public readonly pairId: string,
  ) {}
}
