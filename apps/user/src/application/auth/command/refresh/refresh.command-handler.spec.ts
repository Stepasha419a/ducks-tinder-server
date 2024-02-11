import { Test } from '@nestjs/testing';
import { RefreshCommand } from './refresh.command';
import { RefreshCommandHandler } from './refresh.command-handler';
import { UserAggregateStub, UserStub } from 'apps/user/src/test/user/stub';
import { HttpStatus } from '@nestjs/common';
import { TokenAdapter } from 'apps/user/src/application/token';
import {
  ClientProxyMock,
  TokenAdapterMock,
} from 'apps/user/src/test/auth/mock';
import {
  AccessTokenValueObjectStub,
  AuthUserAggregateStub,
  RefreshTokenValueObjectStub,
} from 'apps/user/src/test/auth/stub';
import { AuthUserAggregate } from 'apps/user/src/domain/auth';
import { ClientProxy } from '@nestjs/microservices';
import { SERVICES } from '@app/common/shared/constant';
import { of } from 'rxjs';

describe('when refresh is called', () => {
  let tokenAdapter: TokenAdapter;
  let userClient: ClientProxy;
  let refreshCommandHandler: RefreshCommandHandler;
  const userStub = UserStub();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RefreshCommandHandler,
        {
          provide: SERVICES.USER,
          useValue: ClientProxyMock(),
        },
        { provide: TokenAdapter, useValue: TokenAdapterMock() },
      ],
    }).compile();

    userClient = moduleRef.get<ClientProxy>(SERVICES.USER);
    tokenAdapter = moduleRef.get<TokenAdapter>(TokenAdapter);
    refreshCommandHandler = moduleRef.get<RefreshCommandHandler>(
      RefreshCommandHandler,
    );
  });

  describe('when it is called correctly', () => {
    beforeAll(async () => {
      tokenAdapter.validateRefreshToken = jest.fn().mockResolvedValue({
        userId: UserStub().id,
      });
      userClient.send = jest.fn().mockReturnValue(of(UserAggregateStub()));
      tokenAdapter.generateTokens = jest.fn().mockResolvedValue({
        refreshTokenValueObject: RefreshTokenValueObjectStub(),
        accessTokenValueObject: AccessTokenValueObjectStub(),
      });
    });

    let data: AuthUserAggregate;

    beforeEach(async () => {
      jest.clearAllMocks();
      data = await refreshCommandHandler.execute(
        new RefreshCommand('refresh-token-value'),
      );
    });

    it('should call tokenAdapter validateRefreshToken', () => {
      expect(tokenAdapter.validateRefreshToken).toHaveBeenCalledTimes(1);
      expect(tokenAdapter.validateRefreshToken).toHaveBeenCalledWith(
        'refresh-token-value',
      );
    });

    it('should call userClient send', () => {
      expect(userClient.send).toHaveBeenCalledTimes(1);
      expect(userClient.send).toHaveBeenCalledWith('get_user', userStub.id);
    });

    it('should call tokenAdapter generateTokens', () => {
      expect(tokenAdapter.generateTokens).toHaveBeenCalledTimes(1);
      expect(tokenAdapter.generateTokens).toHaveBeenCalledWith({
        userId: userStub.id,
        email: userStub.email,
      });
    });

    it('should return AuthUserAggregate', () => {
      expect(JSON.parse(JSON.stringify(data))).toEqual(AuthUserAggregateStub());
    });
  });

  describe('when there is no refreshTokenValue', () => {
    beforeAll(async () => {
      tokenAdapter.validateRefreshToken = jest.fn().mockResolvedValue({
        userId: UserStub().id,
      });
      userClient.send = jest.fn().mockReturnValue(of(UserAggregateStub()));
      tokenAdapter.generateTokens = jest.fn().mockResolvedValue({
        refreshTokenValueObject: RefreshTokenValueObjectStub(),
        accessTokenValueObject: AccessTokenValueObjectStub(),
      });
    });

    let data: AuthUserAggregate;
    let error;

    beforeEach(async () => {
      jest.clearAllMocks();
      try {
        data = await refreshCommandHandler.execute(
          new RefreshCommand(undefined),
        );
      } catch (responseError) {
        error = responseError;
      }
    });

    it('should not call tokenAdapter validateRefreshToken', () => {
      expect(tokenAdapter.validateRefreshToken).not.toBeCalled();
    });

    it('should not call userClient send', () => {
      expect(userClient.send).not.toHaveBeenCalled();
    });

    it('should not call tokenAdapter generateTokens', () => {
      expect(tokenAdapter.generateTokens).not.toBeCalled();
    });

    it('should not return AuthUserAggregate', () => {
      expect(data).toEqual(undefined);
    });

    it('should throw an error', () => {
      expect(error?.message).toEqual('Unauthorized');
      expect(error?.status).toEqual(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('when there is no userData', () => {
    beforeAll(async () => {
      tokenAdapter.validateRefreshToken = jest.fn().mockResolvedValue(null);
      userClient.send = jest.fn().mockReturnValue(of(UserAggregateStub()));
      tokenAdapter.generateTokens = jest.fn().mockResolvedValue({
        refreshTokenValueObject: RefreshTokenValueObjectStub(),
        accessTokenValueObject: AccessTokenValueObjectStub(),
      });
    });

    let data: AuthUserAggregate;
    let error;

    beforeEach(async () => {
      jest.clearAllMocks();
      try {
        data = await refreshCommandHandler.execute(
          new RefreshCommand('refresh-token-value'),
        );
      } catch (responseError) {
        error = responseError;
      }
    });

    it('should call tokenAdapter validateRefreshToken', () => {
      expect(tokenAdapter.validateRefreshToken).toBeCalledWith(
        'refresh-token-value',
      );
    });

    it('should not call userClient send', () => {
      expect(userClient.send).not.toHaveBeenCalled();
    });

    it('should not call tokenAdapter generateTokens', () => {
      expect(tokenAdapter.generateTokens).not.toBeCalled();
    });

    it('should not return AuthUserAggregate', () => {
      expect(data).toEqual(undefined);
    });

    it('should throw an error', () => {
      expect(error?.message).toEqual('Unauthorized');
      expect(error?.status).toEqual(HttpStatus.UNAUTHORIZED);
    });
  });
});
