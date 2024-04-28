export class GetMatchQuery {
  constructor(
    public readonly userId: string,
    public readonly matchUserId?: string,
  ) {}
}
