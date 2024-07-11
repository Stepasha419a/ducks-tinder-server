export class DeletePairCommand {
  constructor(
    public readonly userId: string,
    public readonly pairId: string,
  ) {}
}
