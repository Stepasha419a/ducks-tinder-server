export class GetChatMemberQuery {
  constructor(
    public readonly userId: string,
    public readonly memberId: string,
  ) {}
}
