import { Test } from '@nestjs/testing';
import { RegisterCommand } from './register.command';
import { RegisterCommandHandler } from './register.command-handler';
import { HttpStatus } from '@nestjs/common';
import {
  AccessTokenValueObjectStub,
  AuthUserViewStub,
  RefreshTokenValueObjectStub,
  UserAggregateStub,
  UserStub,
} from 'apps/user/src/test/stub';
import { COMMON_ERROR } from '@app/common/shared/constant';
import { UserRepository } from 'apps/user/src/domain/user/repository';
import { TokenFacadeMock, UserRepositoryMock } from 'apps/user/src/test/mock';
import { TokenFacade } from '../../../token';
import { AuthUserView } from '../../view';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

import * as bcrypt from 'bcryptjs';

jest.mock('apps/user/src/domain/user', () => ({
  UserAggregate: jest.fn(),
}));

import { UserAggregate } from 'apps/user/src/domain/user';

describe('when registration is called', () => {
  let userRepository: UserRepository;
  let tokenFacade: TokenFacade;
  let registerCommandHandler: RegisterCommandHandler;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RegisterCommandHandler,
        { provide: UserRepository, useValue: UserRepositoryMock() },
        { provide: TokenFacade, useValue: TokenFacadeMock() },
      ],
    }).compile();

    userRepository = moduleRef.get<UserRepository>(UserRepository);
    tokenFacade = moduleRef.get<TokenFacade>(TokenFacade);
    registerCommandHandler = moduleRef.get<RegisterCommandHandler>(
      RegisterCommandHandler,
    );
  });

  describe('when it is called correctly', () => {
    beforeAll(() => {
      userRepository.findOneByEmail = jest.fn().mockResolvedValue(undefined);
      bcrypt.hash = jest.fn().mockResolvedValue(UserStub().password);
      UserAggregate.create = jest.fn().mockReturnValue(UserAggregateStub());
      tokenFacade.commands.generateTokens = jest.fn().mockResolvedValue({
        refreshTokenValueObject: RefreshTokenValueObjectStub(),
        accessTokenValueObject: AccessTokenValueObjectStub(),
      });
      userRepository.save = jest.fn().mockResolvedValue(UserAggregateStub());
    });

    let data: AuthUserView;

    beforeEach(async () => {
      jest.clearAllMocks();

      const dto = {
        email: UserStub().email,
        name: UserStub().name,
        password: UserStub().password,
      };

      data = await registerCommandHandler.execute(new RegisterCommand(dto));
    });

    it('should call userRepository findOneByEmail', () => {
      expect(userRepository.findOneByEmail).toHaveBeenCalledTimes(1);
      expect(userRepository.findOneByEmail).toHaveBeenCalledWith(
        UserStub().email,
      );
    });

    it('should call bcrypt hash', () => {
      expect(bcrypt.hash).toHaveBeenCalledTimes(1);
      expect(bcrypt.hash).toHaveBeenCalledWith(UserStub().password, 7);
    });

    it('should call tokenFacade generateTokens', () => {
      expect(tokenFacade.commands.generateTokens).toHaveBeenCalledTimes(1);
      expect(tokenFacade.commands.generateTokens).toHaveBeenCalledWith({
        userId: UserStub().id,
        email: UserStub().email,
      });
    });

    it('should call userRepository save', () => {
      expect(userRepository.save).toHaveBeenCalledTimes(1);

      const calledWithArg = (userRepository.save as jest.Mock).mock.calls[0][0];
      expect(JSON.parse(JSON.stringify(calledWithArg))).toEqual(
        JSON.parse(JSON.stringify(UserAggregateStub())),
      );
    });

    it('should return authUserView', () => {
      expect(JSON.parse(JSON.stringify(data))).toStrictEqual(
        AuthUserViewStub(),
      );
    });
  });

  describe('when there is already using email', () => {
    beforeAll(() => {
      userRepository.findOneByEmail = jest
        .fn()
        .mockResolvedValue(UserAggregateStub());
      UserAggregate.create = jest.fn().mockReturnValue(UserAggregateStub());
      tokenFacade.commands.generateTokens = jest.fn().mockResolvedValue({
        refreshTokenValueObject: RefreshTokenValueObjectStub(),
        accessTokenValueObject: AccessTokenValueObjectStub(),
      });
      userRepository.save = jest.fn().mockResolvedValue(UserAggregateStub());
    });

    let data: AuthUserView;
    let error;

    beforeEach(async () => {
      jest.clearAllMocks();

      const dto = {
        email: UserStub().email,
        name: UserStub().name,
        password: UserStub().password,
      };
      try {
        data = await registerCommandHandler.execute(new RegisterCommand(dto));
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

    it('should not call bcrypt hash', () => {
      expect(bcrypt.hash).not.toHaveBeenCalled();
    });

    it('should not call tokenFacade generateTokens', () => {
      expect(tokenFacade.commands.generateTokens).not.toHaveBeenCalled();
    });

    it('should not call userRepository save', () => {
      expect(userRepository.save).not.toHaveBeenCalled();
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
