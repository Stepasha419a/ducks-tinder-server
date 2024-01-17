import { Test } from '@nestjs/testing';
import { RegisterCommand } from './register.command';
import { RegisterCommandHandler } from './register.command-handler';
import { UserAggregateStub, UserStub } from 'user/test/stub';
import { USER_ALREADY_EXISTS } from 'common/constants/error';
import { HttpStatus } from '@nestjs/common';
import { UserService } from 'user/interface';
import { TokenAdapter } from 'auth/application/adapter/token';
import { TokenAdapterMock, UserServiceMock } from 'auth/test/mock';
import { AuthUserAggregate } from 'auth/domain';
import {
  AccessTokenValueObjectStub,
  AuthUserAggregateStub,
  RefreshTokenValueObjectStub,
} from 'auth/test/stub';

describe('when registration is called', () => {
  let userService: UserService;
  let tokenAdapter: TokenAdapter;
  let registerCommandHandler: RegisterCommandHandler;
  const userStub = UserStub();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RegisterCommandHandler,
        { provide: UserService, useValue: UserServiceMock() },
        { provide: TokenAdapter, useValue: TokenAdapterMock() },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    tokenAdapter = moduleRef.get<TokenAdapter>(TokenAdapter);
    registerCommandHandler = moduleRef.get<RegisterCommandHandler>(
      RegisterCommandHandler,
    );
  });

  describe('when it is called correctly', () => {
    beforeAll(() => {
      userService.getUserByEmail = jest.fn().mockResolvedValue(undefined);
      userService.createUser = jest.fn().mockResolvedValue(UserAggregateStub());
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

    it('should call userService getUserByEmail', () => {
      expect(userService.getUserByEmail).toBeCalledWith(userStub.email);
    });

    it('should call userService createUser', () => {
      // password is custom with bcrypt
      expect(userService.createUser).toBeCalledTimes(1);
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

  describe('when there is already using email', () => {
    beforeAll(() => {
      userService.getUserByEmail = jest
        .fn()
        .mockResolvedValue(UserAggregateStub());
      userService.createUser = jest.fn().mockResolvedValue(UserAggregateStub());
      tokenAdapter.generateTokens = jest.fn().mockResolvedValue({
        refreshTokenValueObject: RefreshTokenValueObjectStub(),
        accessTokenValueObject: AccessTokenValueObjectStub(),
      });
    });

    let data: AuthUserAggregate;
    let error;

    beforeEach(async () => {
      jest.clearAllMocks();
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

    it('should call userService getUserByEmail', () => {
      expect(userService.getUserByEmail).toBeCalledWith(userStub.email);
    });

    it('should not call userService createUser', () => {
      expect(userService.createUser).not.toBeCalled();
    });

    it('should not call tokenAdapter generateTokens', () => {
      expect(tokenAdapter.generateTokens).not.toBeCalled();
    });

    it('should not return authUserAggregate', () => {
      expect(data).toEqual(undefined);
    });

    it('should throw an error', () => {
      expect(error?.message).toEqual(USER_ALREADY_EXISTS);
      expect(error?.status).toEqual(HttpStatus.BAD_REQUEST);
    });
  });
});
