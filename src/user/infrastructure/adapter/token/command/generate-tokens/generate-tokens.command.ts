import { UserTokenDto } from 'user/application/adapter';

export class GenerateTokensCommand {
  constructor(public readonly dto: UserTokenDto) {}
}
