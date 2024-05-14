import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TokenFacade } from '../../application/token';

@Controller('token')
export class TokenController {
  constructor(private readonly facade: TokenFacade) {}

  @MessagePattern('validate_access_token')
  async validateAccessToken(@Payload() accessTokenValue: string) {
    return this.facade.queries.validateAccessToken(accessTokenValue);
  }

  @MessagePattern('validate_refresh_token')
  async validateRefreshToken(@Payload() refreshTokenValue: string) {
    return this.facade.queries.validateRefreshToken(refreshTokenValue);
  }
}
