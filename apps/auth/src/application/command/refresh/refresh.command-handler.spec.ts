import { Test } from '@nestjs/testing';
import { RefreshCommand } from './refresh.command';
import { RefreshCommandHandler } from './refresh.command-handler';
import { UserAggregateStub, UserStub } from 'apps/user/src/test/stub';
import { HttpStatus } from '@nestjs/common';
import { TokenAdapter } from 'auth/application/adapter/token';
import { TokenAdapterMock, UserServiceMock } from 'auth/test/mock';
import {
  AccessTokenValueObjectStub,
  AuthUserAggregateStub,
  RefreshTokenValueObjectStub,
} from 'auth/test/stub';
import { AuthUserAggregate } from 'auth/domain';
import { UserService } from 'apps/user/src/interface';

describe('when refresh is called', () => {
  let tokenAdapter: TokenAdapter;
  let userService: UserService;
  let refreshCommandHandler: RefreshCommandHandler;
  const userStub = UserStub();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RefreshCommandHandler,
        {
          provide: UserService,
          useValue: UserServiceMock(),
        },
        { provide: TokenAdapter, useValue: TokenAdapterMock() },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
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
      userService.getUser = jest.fn().mockResolvedValue(UserAggregateStub());
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
      expect(tokenAdapter.validateRefreshToken).toBeCalledWith(
        'refresh-token-value',
      );
    });

    it('should call userService getUser', () => {
      expect(userService.getUser).toBeCalledWith(userStub.id);
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

  describe('when there is no refreshTokenValue', () => {
    beforeAll(async () => {
      tokenAdapter.validateRefreshToken = jest.fn().mockResolvedValue({
        userId: UserStub().id,
      });
      userService.getUser = jest.fn().mockResolvedValue(UserAggregateStub());
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

    it('should not call userService getUser', () => {
      expect(userService.getUser).not.toBeCalled();
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
      userService.getUser = jest.fn().mockResolvedValue(UserAggregateStub());
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

    it('should not call userService getUser', () => {
      expect(userService.getUser).not.toBeCalled();
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
