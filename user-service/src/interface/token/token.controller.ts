import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtService } from 'src/domain/service/jwt';

@Controller('token')
export class TokenController {
  constructor(private readonly jwtService: JwtService) {}

  @MessagePattern('validate_access_token')
  async validateAccessToken(@Payload() accessTokenValue: string) {
    return this.jwtService.validateAccessToken(accessTokenValue);
  }
}
