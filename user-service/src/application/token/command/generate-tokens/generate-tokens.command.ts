import { UserTokenDto } from '../dto';

export class GenerateTokensCommand {
  constructor(public readonly dto: UserTokenDto) {}
}
