import { Test } from '@nestjs/testing';
import { RegisterCommand } from './register.command';
import { RegisterCommandHandler } from './register.command-handler';
import { TokenAdapter } from 'user/application/adapter';
import { TokenAdapterMock, UserRepositoryMock } from 'user/test/mock';
import { UserRepository } from 'user/application/repository';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'user/user.module';
import {
  AccessTokenValueObjectStub,
  AuthUserAggregateStub,
  RefreshTokenValueObjectStub,
  UserAggregateStub,
  UserStub,
} from 'user/test/stub';
import { AuthUserAggregate } from 'user/domain/auth';

describe('when registration is called', () => {
  let repository: UserRepository;
  let tokenAdapter: TokenAdapter;
  let registerCommandHandler: RegisterCommandHandler;
  const userStub = UserStub();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RegisterCommandHandler,
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
    registerCommandHandler = moduleRef.get<RegisterCommandHandler>(
      RegisterCommandHandler,
    );
  });

  describe('when it is called correctly', () => {
    beforeAll(() => {
      repository.findOneByEmail = jest.fn().mockResolvedValue(undefined);
      repository.save = jest.fn().mockResolvedValue(UserAggregateStub());
      tokenAdapter.generateTokens = jest.fn().mockResolvedValue({
        refreshTokenValueObject: RefreshTokenValueObjectStub(),
        accessTokenValueObject: AccessTokenValueObjectStub(),
      });
    });

    let data: AuthUserAggregate;

    beforeEach(async () => {
      jest.clearAllMocks();
      const dto = {
        email: userStub.email,
        name: userStub.name,
        password: userStub.password,
      };
      data = await registerCommandHandler.execute(new RegisterCommand(dto));
    });

    it('should call repository findOneByEmail', () => {
      expect(repository.findOneByEmail).toBeCalledWith(userStub.email);
    });

    it('should call repository save', () => {
      // password is custom with bcrypt
      expect(repository.save).toBeCalledTimes(1);
    });

    it('should call tokenAdapter generateTokens', () => {
      expect(tokenAdapter.generateTokens).toBeCalledWith({
        userId: userStub.id,
        email: userStub.email,
      });
    });

    it('should return authUserAggregate', () => {
      expect(JSON.parse(JSON.stringify(data))).toStrictEqual(
        AuthUserAggregateStub(),
      );
    });
  });
});