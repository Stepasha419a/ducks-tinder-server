import { UserTokenDto } from 'apps/auth/src/application/adapter/token';

export class GenerateTokensCommand {
  constructor(public readonly dto: UserTokenDto) {}
}
