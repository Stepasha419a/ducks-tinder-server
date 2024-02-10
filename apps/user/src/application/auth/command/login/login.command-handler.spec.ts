import { Test } from '@nestjs/testing';
import { LoginCommandHandler } from './login.command-handler';
import { LoginCommand } from './login.command';
import { HttpStatus } from '@nestjs/common';
import { TokenAdapter } from 'apps/user/src/application/auth/adapter/token';
import {
  ClientProxyMock,
  TokenAdapterMock,
} from 'apps/user/src/test/auth/mock';
import {
  AccessTokenValueObjectStub,
  AuthUserAggregateStub,
  RefreshTokenValueObjectStub,
  UserAggregateStub,
} from 'apps/user/src/test/auth/stub';
import { AuthUserAggregate } from 'apps/user/src/domain/auth';
import { ClientProxy } from '@nestjs/microservices';
import { SERVICES } from '@app/common/shared/constant';
import { of } from 'rxjs';
import { ERROR } from 'apps/auth/src/infrastructure/common/constant';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

import * as bcryptjs from 'bcryptjs';

describe('when login is called', () => {
  let userClient: ClientProxy;
  let tokenAdapter: TokenAdapter;
  let loginCommandHandler: LoginCommandHandler;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        LoginCommandHandler,
        { provide: SERVICES.USER, useValue: ClientProxyMock() },
        { provide: TokenAdapter, useValue: TokenAdapterMock() },
      ],
    }).compile();

    userClient = moduleRef.get<ClientProxy>(SERVICES.USER);
    tokenAdapter = moduleRef.get<TokenAdapter>(TokenAdapter);
    loginCommandHandler =
      moduleRef.get<LoginCommandHandler>(LoginCommandHandler);
  });

  describe('when it is called correctly', () => {
    const userAggregate = UserAggregateStub();

    beforeAll(() => {
      userClient.send = jest.fn().mockReturnValue(of(userAggregate));
      bcryptjs.compare = jest.fn().mockResolvedValue(true);
      tokenAdapter.generateTokens = jest.fn().mockResolvedValue({
        refreshTokenValueObject: RefreshTokenValueObjectStub(),
        accessTokenValueObject: AccessTokenValueObjectStub(),
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

    it('should call userClient send', () => {
      expect(userClient.send).toHaveBeenCalledTimes(1);
      expect(userClient.send).toHaveBeenCalledWith(
        'get_user_by_email',
        userAggregate.email,
      );
    });

    it('should call tokenAdapter generateTokens', () => {
      expect(tokenAdapter.generateTokens).toHaveBeenCalledTimes(1);
      expect(tokenAdapter.generateTokens).toHaveBeenCalledWith({
        userId: userAggregate.id,
        email: userAggregate.email,
      });
    });

    it('should return authUserAggregate', () => {
      expect(JSON.parse(JSON.stringify(data))).toStrictEqual(
        AuthUserAggregateStub(),
      );
    });
  });

  describe('when there is no such user', () => {
    const userAggregate = UserAggregateStub();

    beforeAll(() => {
      userClient.send = jest.fn().mockReturnValue(of(undefined));
      bcryptjs.compare = jest.fn().mockResolvedValue(true);
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
        data = await loginCommandHandler.execute(
          new LoginCommand({
            email: userAggregate.email,
            password: userAggregate.password,
          }),
        );
      } catch (responseError) {
        error = responseError;
      }
    });

    it('should call userClient send', () => {
      expect(userClient.send).toHaveBeenCalledTimes(1);
      expect(userClient.send).toHaveBeenCalledWith(
        'get_user_by_email',
        userAggregate.email,
      );
    });

    it('should not call tokenAdapter generateTokens', () => {
      expect(tokenAdapter.generateTokens).not.toHaveBeenCalled();
    });

    it('should not return authUserAggregate', () => {
      expect(data).toEqual(undefined);
    });

    it('should throw an error', () => {
      expect(error?.message).toEqual(ERROR.INCORRECT_EMAIL_OR_PASSWORD);
      expect(error?.status).toEqual(HttpStatus.FORBIDDEN);
    });
  });

  describe('when there is a wrong password', () => {
    const userAggregate = UserAggregateStub();

    beforeAll(() => {
      userClient.send = jest.fn().mockReturnValue(of(userAggregate));
      bcryptjs.compare = jest.fn().mockResolvedValue(false);
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
        data = await loginCommandHandler.execute(
          new LoginCommand({
            email: userAggregate.email,
            password: userAggregate.password,
          }),
        );
      } catch (responseError) {
        error = responseError;
      }
    });

    it('should call userClient send', () => {
      expect(userClient.send).toHaveBeenCalledTimes(1);
      expect(userClient.send).toHaveBeenCalledWith(
        'get_user_by_email',
        userAggregate.email,
      );
    });

    it('should not call tokenAdapter generateTokens', () => {
      expect(tokenAdapter.generateTokens).not.toHaveBeenCalled();
    });

    it('should not return authUserAggregate', () => {
      expect(data).toEqual(undefined);
    });

    it('should throw an error', () => {
      expect(error?.message).toEqual(ERROR.INCORRECT_EMAIL_OR_PASSWORD);
      expect(error?.status).toEqual(HttpStatus.FORBIDDEN);
    });
  });
});
