import { Test } from '@nestjs/testing';
import { ValidateRefreshTokenCommand } from './validate-refresh-token.command';
import { ValidateRefreshTokenCommandHandler } from './validate-refresh-token.command-handler';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from 'user/domain/repository';
import {
  ConfigServiceMock,
  JwtServiceMock,
  UserRepositoryMock,
} from 'user/test/mock';
import { RefreshTokenValueObjectStub, UserStub } from 'user/test/stub';
import { UserTokenDto } from 'user/application/adapter';
import { HttpStatus } from '@nestjs/common';

describe('when validateRefreshToken is called', () => {
  let repository: UserRepository;
  let jwtService: JwtService;
  let configService: ConfigService;

  let validateRefreshTokenCommandHandler: ValidateRefreshTokenCommandHandler;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ValidateRefreshTokenCommandHandler,
        { provide: UserRepository, useValue: UserRepositoryMock() },
        { provide: JwtService, useValue: JwtServiceMock() },
        { provide: ConfigService, useValue: ConfigServiceMock() },
      ],
    }).compile();

    repository = moduleRef.get<UserRepository>(UserRepository);
    jwtService = moduleRef.get<JwtService>(JwtService);
    configService = moduleRef.get<ConfigService>(ConfigService);
    validateRefreshTokenCommandHandler =
      moduleRef.get<ValidateRefreshTokenCommandHandler>(
        ValidateRefreshTokenCommandHandler,
      );
  });

  describe('when it is called correctly', () => {
    let response;

    beforeEach(async () => {
      jest.clearAllMocks();

      repository.findRefreshTokenByValue = jest
        .fn()
        .mockResolvedValue(RefreshTokenValueObjectStub());
      configService.get = jest.fn().mockReturnValue('TOKENS_SECRET');
      jwtService.verify = jest.fn().mockResolvedValue({
        email: UserStub().email,
        userId: UserStub().id,
      } as UserTokenDto);

      response = await validateRefreshTokenCommandHandler.execute(
        new ValidateRefreshTokenCommand(RefreshTokenValueObjectStub().value),
      );
    });

    it('should call repository findRefreshTokenByValue', () => {
      expect(repository.findRefreshTokenByValue).toBeCalledTimes(1);
      expect(repository.findRefreshTokenByValue).toHaveBeenCalledWith(
        RefreshTokenValueObjectStub().value,
      );
    });

    it('should call jwtService verify', () => {
      expect(jwtService.verify).toBeCalledTimes(1);
      expect(jwtService.verify).toBeCalledWith(
        RefreshTokenValueObjectStub().value,
        {
          secret: 'TOKENS_SECRET',
        },
      );
    });

    it('should call configService get', () => {
      expect(configService.get).toBeCalledTimes(1);
      expect(configService.get).toBeCalledWith('JWT_REFRESH_SECRET');
    });

    it('should return tokens', () => {
      expect(response).toEqual({
        email: UserStub().email,
        userId: UserStub().id,
      });
    });
  });

  describe('when there is no existingRefreshToken', () => {
    let response;
    let error;

    beforeEach(async () => {
      jest.clearAllMocks();

      repository.findRefreshTokenByValue = jest.fn().mockResolvedValue(null);
      configService.get = jest.fn().mockReturnValue('TOKENS_SECRET');
      jwtService.verify = jest.fn().mockResolvedValue({
        email: UserStub().email,
        userId: UserStub().id,
      } as UserTokenDto);

      try {
        response = await validateRefreshTokenCommandHandler.execute(
          new ValidateRefreshTokenCommand(RefreshTokenValueObjectStub().value),
        );
      } catch (responseError) {
        error = responseError;
      }
    });

    it('should call repository findRefreshTokenByValue', () => {
      expect(repository.findRefreshTokenByValue).toBeCalledTimes(1);
      expect(repository.findRefreshTokenByValue).toHaveBeenCalledWith(
        RefreshTokenValueObjectStub().value,
      );
    });

    it('should not call jwtService verify', () => {
      expect(jwtService.verify).not.toBeCalled();
    });

    it('should not call configService get', () => {
      expect(configService.get).not.toBeCalled();
    });

    it('should return undefined', () => {
      expect(response).toEqual(undefined);
    });

    it('should throw an error', () => {
      expect(error?.message).toEqual('Unauthorized');
      expect(error?.status).toEqual(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('when there is no valid token', () => {
    let response;

    beforeEach(async () => {
      jest.clearAllMocks();

      repository.findRefreshTokenByValue = jest
        .fn()
        .mockResolvedValue(RefreshTokenValueObjectStub());
      configService.get = jest.fn().mockReturnValue('TOKENS_SECRET');
      jwtService.verify = jest.fn().mockImplementation(() => {
        throw new Error('Token is not valid');
      });

      response = await validateRefreshTokenCommandHandler.execute(
        new ValidateRefreshTokenCommand(RefreshTokenValueObjectStub().value),
      );
    });

    it('should call repository findRefreshTokenByValue', () => {
      expect(repository.findRefreshTokenByValue).toBeCalledTimes(1);
      expect(repository.findRefreshTokenByValue).toHaveBeenCalledWith(
        RefreshTokenValueObjectStub().value,
      );
    });

    it('should call jwtService verify', () => {
      expect(jwtService.verify).toBeCalledTimes(1);
      expect(jwtService.verify).toBeCalledWith(
        RefreshTokenValueObjectStub().value,
        {
          secret: 'TOKENS_SECRET',
        },
      );
    });

    it('should call configService get', () => {
      expect(configService.get).toBeCalledTimes(1);
      expect(configService.get).toBeCalledWith('JWT_REFRESH_SECRET');
    });

    it('should return null', () => {
      expect(response).toEqual(null);
    });
  });
});
