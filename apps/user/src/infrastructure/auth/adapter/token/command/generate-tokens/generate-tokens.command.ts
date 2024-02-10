import { UserTokenDto } from 'apps/user/src/application/auth/adapter/token';

export class GenerateTokensCommand {
  constructor(public readonly dto: UserTokenDto) {}
}
