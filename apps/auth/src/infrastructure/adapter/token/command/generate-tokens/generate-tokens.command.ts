import { UserTokenDto } from 'auth/application/adapter/token';

export class GenerateTokensCommand {
  constructor(public readonly dto: UserTokenDto) {}
}
