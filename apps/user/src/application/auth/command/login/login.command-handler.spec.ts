import { Test } from '@nestjs/testing';
import { LoginCommandHandler } from './login.command-handler';
import { LoginCommand } from './login.command';
import { HttpStatus } from '@nestjs/common';
import { TokenFacadeMock, UserRepositoryMock } from 'apps/user/src/test/mock';
import {
  AccessTokenValueObjectStub,
  AuthUserViewStub,
  RefreshTokenValueObjectStub,
  UserAggregateStub,
  UserStub,
} from 'apps/user/src/test/stub';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

import * as bcryptjs from 'bcryptjs';
import { TokenFacade } from '../../../token';
import { AuthUserView } from '../../view';
import { ERROR } from 'apps/user/src/infrastructure/auth/common/constant';
import { UserRepository } from 'apps/user/src/domain/user/repository';

describe('when login is called', () => {
  let userRepository: UserRepository;
  let tokenFacade: TokenFacade;
  let loginCommandHandler: LoginCommandHandler;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        LoginCommandHandler,
        { provide: UserRepository, useValue: UserRepositoryMock() },
        { provide: TokenFacade, useValue: TokenFacadeMock() },
      ],
    }).compile();

    userRepository = moduleRef.get<UserRepository>(UserRepository);
    tokenFacade = moduleRef.get<TokenFacade>(TokenFacade);
    loginCommandHandler =
      moduleRef.get<LoginCommandHandler>(LoginCommandHandler);
  });

  describe('when it is called correctly', () => {
    beforeAll(() => {
      userRepository.findOneByEmail = jest
        .fn()
        .mockReturnValue(UserAggregateStub());
      bcryptjs.compare = jest.fn().mockResolvedValue(true);
      tokenFacade.commands.generateTokens = jest.fn().mockResolvedValue({
        refreshTokenValueObject: RefreshTokenValueObjectStub(),
        accessTokenValueObject: AccessTokenValueObjectStub(),
      });
    });

    let data: AuthUserView;

    beforeEach(async () => {
      jest.clearAllMocks();
      data = await loginCommandHandler.execute(
        new LoginCommand({
          email: UserStub().email,
          password: UserStub().password,
        }),
      );
    });

    it('should call userRepository findOneByEmail', () => {
      expect(userRepository.findOneByEmail).toHaveBeenCalledTimes(1);
      expect(userRepository.findOneByEmail).toHaveBeenCalledWith(
        UserStub().email,
      );
    });

    it('should call tokenFacade generateTokens', () => {
      expect(tokenFacade.commands.generateTokens).toHaveBeenCalledTimes(1);
      expect(tokenFacade.commands.generateTokens).toHaveBeenCalledWith({
        userId: UserStub().id,
        email: UserStub().email,
      });
    });

    it('should return authUserView', () => {
      expect(JSON.parse(JSON.stringify(data))).toStrictEqual(
        AuthUserViewStub(),
      );
    });
  });

  describe('when there is no such user', () => {
    const userAggregate = UserAggregateStub();

    beforeAll(() => {
      userRepository.findOneByEmail = jest.fn().mockReturnValue(null);
      bcryptjs.compare = jest.fn().mockResolvedValue(true);
      tokenFacade.commands.generateTokens = jest.fn().mockResolvedValue({
        refreshTokenValueObject: RefreshTokenValueObjectStub(),
        accessTokenValueObject: AccessTokenValueObjectStub(),
      });
    });

    let data: AuthUserView;
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

    it('should call userRepository findOneByEmail', () => {
      expect(userRepository.findOneByEmail).toHaveBeenCalledTimes(1);
      expect(userRepository.findOneByEmail).toHaveBeenCalledWith(
        UserStub().email,
      );
    });

    it('should not call tokenFacade generateTokens', () => {
      expect(tokenFacade.commands.generateTokens).not.toHaveBeenCalled();
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
      userRepository.findOneByEmail = jest
        .fn()
        .mockReturnValue(UserAggregateStub());
      bcryptjs.compare = jest.fn().mockResolvedValue(false);
      tokenFacade.commands.generateTokens = jest.fn().mockResolvedValue({
        refreshTokenValueObject: RefreshTokenValueObjectStub(),
        accessTokenValueObject: AccessTokenValueObjectStub(),
      });
    });

    let data: AuthUserView;
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

    it('should call userRepository findOneByEmail', () => {
      expect(userRepository.findOneByEmail).toHaveBeenCalledTimes(1);
      expect(userRepository.findOneByEmail).toHaveBeenCalledWith(
        UserStub().email,
      );
    });

    it('should not call tokenFacade generateTokens', () => {
      expect(tokenFacade.commands.generateTokens).not.toHaveBeenCalled();
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
