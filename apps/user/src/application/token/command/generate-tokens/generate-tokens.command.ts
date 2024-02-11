import { UserTokenDto } from 'apps/user/src/application/token';

export class GenerateTokensCommand {
  constructor(public readonly dto: UserTokenDto) {}
}
