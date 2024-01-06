import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { RefreshCommand } from './refresh.command';
import { RefreshCommandHandler } from './refresh.command-handler';
import { TokenAdapter } from 'user/application/adapter';
import { UserRepository } from 'user/application/repository';
import { TokenAdapterMock, UserRepositoryMock } from 'user/test/mock';
import { AuthUserAggregate } from 'user/domain/auth';
import {
  AccessTokenValueObjectStub,
  AuthUserAggregateStub,
  RefreshTokenValueObjectStub,
  UserAggregateStub,
  UserStub,
} from 'user/test/stub';

describe('when refresh is called', () => {
  let tokenAdapter: TokenAdapter;
  let repository: UserRepository;
  let refreshCommandHandler: RefreshCommandHandler;
  const userStub = UserStub();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RefreshCommandHandler,
        { provide: UserRepository, useValue: UserRepositoryMock() },
        { provide: TokenAdapter, useValue: TokenAdapterMock() },
      ],
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: `.env.${process.env.NODE_ENV}`,
        }),
      ],
    }).compile();

    repository = moduleRef.get<UserRepository>(UserRepository);
    tokenAdapter = moduleRef.get<TokenAdapter>(TokenAdapter);
    refreshCommandHandler = moduleRef.get<RefreshCommandHandler>(
      RefreshCommandHandler,
    );
  });

  let data: AuthUserAggregate;

  describe('when it is called correctly', () => {
    beforeAll(async () => {
      tokenAdapter.validateRefreshToken = jest.fn().mockResolvedValue({
        userId: UserStub().id,
      });
      repository.findOne = jest.fn().mockResolvedValue(UserAggregateStub());
      tokenAdapter.generateTokens = jest.fn().mockResolvedValue({
        refreshTokenAggregate: RefreshTokenValueObjectStub(),
        accessTokenAggregate: AccessTokenValueObjectStub(),
      });
    });

    beforeEach(async () => {
      jest.clearAllMocks();
      data = await refreshCommandHandler.execute(
        new RefreshCommand('refresh-token-value'),
      );
    });

    it('should call tokenAdapter validateRefreshToken', () => {
      expect(tokenAdapter.validateRefreshToken).toBeCalledWith(
        'refresh-token-value',
      );
    });

    it('should call repository findOne', () => {
      expect(repository.findOne).toBeCalledWith(userStub.id);
    });

    it('should call tokenAdapter generateTokens', () => {
      expect(tokenAdapter.generateTokens).toBeCalledWith({
        userId: userStub.id,
        email: userStub.email,
      });
    });

    it('should return AuthUserAggregate', () => {
      expect(JSON.parse(JSON.stringify(data))).toEqual(AuthUserAggregateStub());
    });
  });
});
