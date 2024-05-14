import { Test } from '@nestjs/testing';
import { RefreshCommand } from './refresh.command';
import { RefreshCommandHandler } from './refresh.command-handler';
import { HttpStatus } from '@nestjs/common';
import {
  TokenFacadeMock,
  UserRepositoryMock,
} from 'user-service/src/test/mock';
import {
  AccessTokenValueObjectStub,
  AuthUserViewStub,
  RefreshTokenValueObjectStub,
  UserAggregateStub,
  UserStub,
} from 'user-service/src/test/stub';
import { TokenFacade } from '../../../token';
import { UserRepository } from 'user-service/src/domain/user/repository';
import { AuthUserView } from '../../view';

describe('when refresh is called', () => {
  let tokenFacade: TokenFacade;
  let userRepository: UserRepository;
  let refreshCommandHandler: RefreshCommandHandler;
  const userStub = UserStub();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RefreshCommandHandler,
        {
          provide: UserRepository,
          useValue: UserRepositoryMock(),
        },
        { provide: TokenFacade, useValue: TokenFacadeMock() },
      ],
    }).compile();

    userRepository = moduleRef.get<UserRepository>(UserRepository);
    tokenFacade = moduleRef.get<TokenFacade>(TokenFacade);
    refreshCommandHandler = moduleRef.get<RefreshCommandHandler>(
      RefreshCommandHandler,
    );
  });

  describe('when it is called correctly', () => {
    beforeAll(async () => {
      tokenFacade.queries.validateRefreshToken = jest.fn().mockResolvedValue({
        userId: UserStub().id,
      });
      userRepository.findOne = jest.fn().mockReturnValue(UserAggregateStub());
      tokenFacade.commands.generateTokens = jest.fn().mockResolvedValue({
        refreshTokenValueObject: RefreshTokenValueObjectStub(),
        accessTokenValueObject: AccessTokenValueObjectStub(),
      });
    });

    let data: AuthUserView;

    beforeEach(async () => {
      jest.clearAllMocks();
      data = await refreshCommandHandler.execute(
        new RefreshCommand('refresh-token-value'),
      );
    });

    it('should call tokenFacade validateRefreshToken', () => {
      expect(tokenFacade.queries.validateRefreshToken).toHaveBeenCalledTimes(1);
      expect(tokenFacade.queries.validateRefreshToken).toHaveBeenCalledWith(
        'refresh-token-value',
      );
    });

    it('should call userRepository findOne', () => {
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith(userStub.id);
    });

    it('should call tokenFacade generateTokens', () => {
      expect(tokenFacade.commands.generateTokens).toHaveBeenCalledTimes(1);
      expect(tokenFacade.commands.generateTokens).toHaveBeenCalledWith({
        userId: userStub.id,
        email: userStub.email,
      });
    });

    it('should return AuthUserView', () => {
      expect(JSON.parse(JSON.stringify(data))).toEqual(AuthUserViewStub());
    });
  });

  describe('when there is no refreshTokenValue', () => {
    beforeAll(async () => {
      tokenFacade.queries.validateRefreshToken = jest.fn().mockResolvedValue({
        userId: UserStub().id,
      });
      userRepository.findOne = jest.fn().mockReturnValue(UserAggregateStub());
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
        data = await refreshCommandHandler.execute(
          new RefreshCommand(undefined),
        );
      } catch (responseError) {
        error = responseError;
      }
    });

    it('should not call tokenFacade validateRefreshToken', () => {
      expect(tokenFacade.queries.validateRefreshToken).not.toHaveBeenCalled();
    });

    it('should not call userRepository findOne', () => {
      expect(userRepository.findOne).not.toHaveBeenCalled();
    });

    it('should not call tokenFacade generateTokens', () => {
      expect(tokenFacade.commands.generateTokens).not.toHaveBeenCalled();
    });

    it('should not return AuthUserView', () => {
      expect(data).toEqual(undefined);
    });

    it('should throw an error', () => {
      expect(error?.message).toEqual('Unauthorized');
      expect(error?.status).toEqual(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('when there is no userData', () => {
    beforeAll(async () => {
      tokenFacade.queries.validateRefreshToken = jest
        .fn()
        .mockResolvedValue(null);
      userRepository.findOne = jest.fn().mockReturnValue(UserAggregateStub());
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
        data = await refreshCommandHandler.execute(
          new RefreshCommand('refresh-token-value'),
        );
      } catch (responseError) {
        error = responseError;
      }
    });

    it('should call tokenFacade validateRefreshToken', () => {
      expect(tokenFacade.queries.validateRefreshToken).toHaveBeenCalledTimes(1);
      expect(tokenFacade.queries.validateRefreshToken).toHaveBeenCalledWith(
        'refresh-token-value',
      );
    });

    it('should not call userRepository findOne', () => {
      expect(userRepository.findOne).not.toHaveBeenCalled();
    });

    it('should not call tokenFacade generateTokens', () => {
      expect(tokenFacade.commands.generateTokens).not.toHaveBeenCalled();
    });

    it('should not return AuthUserView', () => {
      expect(data).toEqual(undefined);
    });

    it('should throw an error', () => {
      expect(error?.message).toEqual('Unauthorized');
      expect(error?.status).toEqual(HttpStatus.UNAUTHORIZED);
    });
  });
});
