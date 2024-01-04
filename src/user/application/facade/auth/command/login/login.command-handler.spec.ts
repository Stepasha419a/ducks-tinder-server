import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { LoginCommandHandler } from './login.command-handler';
import { LoginCommand } from './login.command';
import { UserModule } from 'user/user.module';
import { TokenAdapterMock, UserRepositoryMock } from 'user/test/mock';
import { TokenAdapter } from 'user/application/adapter';
import { UserRepository } from 'user/application/repository';
import { UserAggregateStub } from 'user/test/stub/user-aggregate.stub';
import { AuthUserAggregate } from 'user/domain/auth';
import { RefreshTokenValueObjectStub } from 'user/test/stub/refresh-token-value-object.stub';
import { AccessTokenValueObjectStub } from 'user/test/stub/access-token-value-object.stub';
import { AuthUserAggregateStub } from 'user/test/stub/auth-user-aggregate.stub';

describe('when login is called', () => {
  let repository: UserRepository;
  let tokenAdapter: TokenAdapter;
  let loginCommandHandler: LoginCommandHandler;
  const userAggregate = UserAggregateStub();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        LoginCommandHandler,
        { provide: UserRepository, useValue: UserRepositoryMock() },
        { provide: TokenAdapter, useValue: TokenAdapterMock() },
      ],
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: `.env.${process.env.NODE_ENV}`,
        }),
        UserModule,
      ],
    }).compile();

    repository = moduleRef.get<UserRepository>(UserRepository);
    tokenAdapter = moduleRef.get<TokenAdapter>(TokenAdapter);
    loginCommandHandler =
      moduleRef.get<LoginCommandHandler>(LoginCommandHandler);
  });

  describe('when it is called correctly', () => {
    beforeAll(() => {
      repository.findOneByEmail = jest.fn().mockResolvedValue(userAggregate);
      userAggregate.comparePasswords = jest.fn().mockResolvedValue(true);
      tokenAdapter.generateTokens = jest.fn().mockResolvedValue({
        refreshTokenAggregate: RefreshTokenValueObjectStub(),
        accessTokenAggregate: AccessTokenValueObjectStub(),
      });
    });

    let data: AuthUserAggregate;

    beforeEach(async () => {
      jest.clearAllMocks();
      data = await loginCommandHandler.execute(
        new LoginCommand({
          email: userAggregate.email,
          password: userAggregate.password,
        }),
      );
    });

    it('should call repository findOneByEmail', () => {
      expect(repository.findOneByEmail).toBeCalledWith(userAggregate.email);
    });

    it('should call aggregate comparePasswords', () => {
      expect(userAggregate.comparePasswords).toBeCalledWith(
        userAggregate.password,
      );
    });

    it('should call tokenAdapter generateTokens', () => {
      expect(tokenAdapter.generateTokens).toBeCalledWith({
        userId: userAggregate.id,
        email: userAggregate.email,
      });
    });

    it('should return authUserAggregate', () => {
      expect(JSON.parse(JSON.stringify(data))).toEqual(AuthUserAggregateStub());
    });
  });
});
