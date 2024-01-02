import {
  LoginUserDto,
  RegisterUserDto,
} from 'user/infrastructure/adapter/auth/command';
import { AuthUserAggregate } from 'user/domain/auth';

export abstract class AuthAdapter {
  abstract register(dto: RegisterUserDto): Promise<AuthUserAggregate>;
  abstract login(dto: LoginUserDto): Promise<AuthUserAggregate>;
  abstract logout(refreshTokenValue: string): Promise<void>;
  abstract refresh(refreshTokenValue: string): Promise<AuthUserAggregate>;
}
