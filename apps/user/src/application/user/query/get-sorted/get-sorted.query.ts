export class GetSortedQuery {
  constructor(
    public readonly userId: string,
    public readonly sortedUserId?: string,
  ) {}
}
