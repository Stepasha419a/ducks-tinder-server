import { Test } from '@nestjs/testing';
import { LoginCommandHandler } from './login.command-handler';
import { LoginCommand } from './login.command';
import { TokenAdapterMock, UserRepositoryMock } from 'user/test/mock';
import { TokenAdapter } from 'user/application/adapter';
import { UserRepository } from 'user/domain/repository';
import { AuthUserAggregate } from 'user/domain/auth';
import {
  AccessTokenValueObjectStub,
  AuthUserAggregateStub,
  RefreshTokenValueObjectStub,
  UserAggregateStub,
} from 'user/test/stub';
import { INCORRECT_EMAIL_OR_PASSWORD } from 'common/constants/error';
import { HttpStatus } from '@nestjs/common';

describe('when login is called', () => {
  let repository: UserRepository;
  let tokenAdapter: TokenAdapter;
  let loginCommandHandler: LoginCommandHandler;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        LoginCommandHandler,
        { provide: UserRepository, useValue: UserRepositoryMock() },
        { provide: TokenAdapter, useValue: TokenAdapterMock() },
      ],
    }).compile();

    repository = moduleRef.get<UserRepository>(UserRepository);
    tokenAdapter = moduleRef.get<TokenAdapter>(TokenAdapter);
    loginCommandHandler =
      moduleRef.get<LoginCommandHandler>(LoginCommandHandler);
  });

  describe('when it is called correctly', () => {
    const userAggregate = UserAggregateStub();

    beforeAll(() => {
      repository.findOneByEmail = jest.fn().mockResolvedValue(userAggregate);
      userAggregate.comparePasswords = jest.fn().mockResolvedValue(true);
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
      expect(JSON.parse(JSON.stringify(data))).toStrictEqual(
        AuthUserAggregateStub(),
      );
    });
  });

  describe('when there is no such user', () => {
    const userAggregate = UserAggregateStub();

    beforeAll(() => {
      repository.findOneByEmail = jest.fn().mockResolvedValue(undefined);
      userAggregate.comparePasswords = jest.fn().mockResolvedValue(true);
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

    it('should call repository findOneByEmail', () => {
      expect(repository.findOneByEmail).toBeCalledWith(userAggregate.email);
    });

    it('should not call aggregate comparePasswords', () => {
      expect(userAggregate.comparePasswords).not.toBeCalled();
    });

    it('should not call tokenAdapter generateTokens', () => {
      expect(tokenAdapter.generateTokens).not.toBeCalled();
    });

    it('should not return authUserAggregate', () => {
      expect(data).toEqual(undefined);
    });

    it('should throw an error', () => {
      expect(error?.message).toEqual(INCORRECT_EMAIL_OR_PASSWORD);
      expect(error?.status).toEqual(HttpStatus.FORBIDDEN);
    });
  });

  describe('when there is a wrong password', () => {
    const userAggregate = UserAggregateStub();

    beforeAll(() => {
      repository.findOneByEmail = jest.fn().mockResolvedValue(userAggregate);
      userAggregate.comparePasswords = jest.fn().mockResolvedValue(false);
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

    it('should call repository findOneByEmail', () => {
      expect(repository.findOneByEmail).toBeCalledWith(userAggregate.email);
    });

    it('should call aggregate comparePasswords', () => {
      expect(userAggregate.comparePasswords).toBeCalledWith(
        userAggregate.password,
      );
    });

    it('should not call tokenAdapter generateTokens', () => {
      expect(tokenAdapter.generateTokens).not.toBeCalled();
    });

    it('should not return authUserAggregate', () => {
      expect(data).toEqual(undefined);
    });

    it('should throw an error', () => {
      expect(error?.message).toEqual(INCORRECT_EMAIL_OR_PASSWORD);
      expect(error?.status).toEqual(HttpStatus.FORBIDDEN);
    });
  });
});
