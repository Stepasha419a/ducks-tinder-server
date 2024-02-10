import { Test } from '@nestjs/testing';
import { RegisterCommand } from './register.command';
import { RegisterCommandHandler } from './register.command-handler';
import { UserAggregateStub, UserStub } from 'apps/user/src/test/user/stub';
import { HttpStatus } from '@nestjs/common';
import { TokenAdapter } from 'apps/user/src/application/auth/adapter/token';
import {
  ClientProxyMock,
  TokenAdapterMock,
} from 'apps/user/src/test/auth/mock';
import { AuthUserAggregate } from 'apps/user/src/domain/auth';
import {
  AccessTokenValueObjectStub,
  AuthUserAggregateStub,
  RefreshTokenValueObjectStub,
} from 'apps/user/src/test/auth/stub';
import { ClientProxy } from '@nestjs/microservices';
import { COMMON_ERROR, SERVICES } from '@app/common/shared/constant';
import { of } from 'rxjs';

describe('when registration is called', () => {
  let userClient: ClientProxy;
  let tokenAdapter: TokenAdapter;
  let registerCommandHandler: RegisterCommandHandler;
  const userStub = UserStub();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RegisterCommandHandler,
        { provide: SERVICES.USER, useValue: ClientProxyMock() },
        { provide: TokenAdapter, useValue: TokenAdapterMock() },
      ],
    }).compile();

    userClient = moduleRef.get<ClientProxy>(SERVICES.USER);
    tokenAdapter = moduleRef.get<TokenAdapter>(TokenAdapter);
    registerCommandHandler = moduleRef.get<RegisterCommandHandler>(
      RegisterCommandHandler,
    );
  });

  describe('when it is called correctly', () => {
    beforeAll(() => {
      tokenAdapter.generateTokens = jest.fn().mockResolvedValue({
        refreshTokenValueObject: RefreshTokenValueObjectStub(),
        accessTokenValueObject: AccessTokenValueObjectStub(),
      });
    });

    let data: AuthUserAggregate;

    beforeEach(async () => {
      jest.clearAllMocks();

      userClient.send = jest
        .fn()
        .mockReturnValueOnce(of(undefined))
        .mockReturnValueOnce(of(UserAggregateStub()));

      const dto = {
        email: userStub.email,
        name: userStub.name,
        password: userStub.password,
      };

      data = await registerCommandHandler.execute(new RegisterCommand(dto));
    });

    it('should call userClient send', () => {
      expect(userClient.send).toHaveBeenCalledTimes(2);
      expect(userClient.send).toHaveBeenNthCalledWith(
        1,
        'get_user_by_email',
        userStub.email,
      );
      expect(userClient.send).toHaveBeenNthCalledWith(
        2,
        'create_user',
        expect.anything(),
      );
    });

    it('should call tokenAdapter generateTokens', () => {
      expect(tokenAdapter.generateTokens).toHaveBeenCalledWith({
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

  describe('when there is already using email', () => {
    beforeAll(() => {
      tokenAdapter.generateTokens = jest.fn().mockResolvedValue({
        refreshTokenValueObject: RefreshTokenValueObjectStub(),
        accessTokenValueObject: AccessTokenValueObjectStub(),
      });
    });

    let data: AuthUserAggregate;
    let error;

    beforeEach(async () => {
      jest.clearAllMocks();

      userClient.send = jest
        .fn()
        .mockReturnValueOnce(of(UserAggregateStub()))
        .mockReturnValueOnce(of(UserAggregateStub()));

      const dto = {
        email: userStub.email,
        name: userStub.name,
        password: userStub.password,
      };
      try {
        data = await registerCommandHandler.execute(new RegisterCommand(dto));
      } catch (responseError) {
        error = responseError;
      }
    });

    it('should call userClient send', () => {
      expect(userClient.send).toHaveBeenCalledTimes(1);
      expect(userClient.send).toHaveBeenCalledWith(
        'get_user_by_email',
        userStub.email,
      );
    });

    it('should not call tokenAdapter generateTokens', () => {
      expect(tokenAdapter.generateTokens).not.toBeCalled();
    });

    it('should not return authUserAggregate', () => {
      expect(data).toEqual(undefined);
    });

    it('should throw an error', () => {
      expect(error?.message).toEqual(COMMON_ERROR.USER_ALREADY_EXISTS);
      expect(error?.status).toEqual(HttpStatus.BAD_REQUEST);
    });
  });
});
