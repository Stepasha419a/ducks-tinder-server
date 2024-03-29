import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HttpStatus } from '@nestjs/common';
import {
  ConfigServiceMock,
  JwtServiceMock,
  TokenRepositoryMock,
} from 'apps/user/src/test/mock';
import { RefreshTokenValueObjectStub, UserStub } from 'apps/user/src/test/stub';
import { ValidateRefreshTokenQueryHandler } from './validate-refresh-token.query-handler';
import { ValidateRefreshTokenQuery } from './validate-refresh-token.query';
import { TokenRepository } from 'apps/user/src/domain/token/repository';
import { UserTokenDto } from '../../command';

describe('when validateRefreshToken is called', () => {
  let repository: TokenRepository;
  let jwtService: JwtService;
  let configService: ConfigService;

  let validateRefreshTokenQueryHandler: ValidateRefreshTokenQueryHandler;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ValidateRefreshTokenQueryHandler,
        {
          provide: TokenRepository,
          useValue: TokenRepositoryMock(),
        },
        { provide: JwtService, useValue: JwtServiceMock() },
        { provide: ConfigService, useValue: ConfigServiceMock() },
      ],
    }).compile();

    repository = moduleRef.get<TokenRepository>(TokenRepository);
    jwtService = moduleRef.get<JwtService>(JwtService);
    configService = moduleRef.get<ConfigService>(ConfigService);
    validateRefreshTokenQueryHandler =
      moduleRef.get<ValidateRefreshTokenQueryHandler>(
        ValidateRefreshTokenQueryHandler,
      );
  });

  describe('when it is called correctly', () => {
    let response;

    beforeEach(async () => {
      jest.clearAllMocks();

      repository.findOneRefreshTokenByValue = jest
        .fn()
        .mockResolvedValue(RefreshTokenValueObjectStub());
      configService.get = jest.fn().mockReturnValue('TOKENS_SECRET');
      jwtService.verify = jest.fn().mockResolvedValue({
        email: UserStub().email,
        userId: UserStub().id,
      } as UserTokenDto);

      response = await validateRefreshTokenQueryHandler.execute(
        new ValidateRefreshTokenQuery(RefreshTokenValueObjectStub().value),
      );
    });

    it('should call repository findOneRefreshTokenByValue', () => {
      expect(repository.findOneRefreshTokenByValue).toHaveBeenCalledTimes(1);
      expect(repository.findOneRefreshTokenByValue).toHaveBeenCalledWith(
        RefreshTokenValueObjectStub().value,
      );
    });

    it('should call jwtService verify', () => {
      expect(jwtService.verify).toHaveBeenCalledTimes(1);
      expect(jwtService.verify).toHaveBeenCalledWith(
        RefreshTokenValueObjectStub().value,
        {
          secret: 'TOKENS_SECRET',
        },
      );
    });

    it('should call configService get', () => {
      expect(configService.get).toHaveBeenCalledTimes(1);
      expect(configService.get).toHaveBeenCalledWith('JWT_REFRESH_SECRET');
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

      repository.findOneRefreshTokenByValue = jest.fn().mockResolvedValue(null);
      configService.get = jest.fn().mockReturnValue('TOKENS_SECRET');
      jwtService.verify = jest.fn().mockResolvedValue({
        email: UserStub().email,
        userId: UserStub().id,
      } as UserTokenDto);

      try {
        response = await validateRefreshTokenQueryHandler.execute(
          new ValidateRefreshTokenQuery(RefreshTokenValueObjectStub().value),
        );
      } catch (responseError) {
        error = responseError;
      }
    });

    it('should call repository findOneRefreshTokenByValue', () => {
      expect(repository.findOneRefreshTokenByValue).toHaveBeenCalledTimes(1);
      expect(repository.findOneRefreshTokenByValue).toHaveBeenCalledWith(
        RefreshTokenValueObjectStub().value,
      );
    });

    it('should not call jwtService verify', () => {
      expect(jwtService.verify).not.toHaveBeenCalled();
    });

    it('should not call configService get', () => {
      expect(configService.get).not.toHaveBeenCalled();
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

      repository.findOneRefreshTokenByValue = jest
        .fn()
        .mockResolvedValue(RefreshTokenValueObjectStub());
      configService.get = jest.fn().mockReturnValue('TOKENS_SECRET');
      jwtService.verify = jest.fn().mockImplementation(() => {
        throw new Error('Token is not valid');
      });

      response = await validateRefreshTokenQueryHandler.execute(
        new ValidateRefreshTokenQuery(RefreshTokenValueObjectStub().value),
      );
    });

    it('should call repository findOneRefreshTokenByValue', () => {
      expect(repository.findOneRefreshTokenByValue).toHaveBeenCalledTimes(1);
      expect(repository.findOneRefreshTokenByValue).toHaveBeenCalledWith(
        RefreshTokenValueObjectStub().value,
      );
    });

    it('should call jwtService verify', () => {
      expect(jwtService.verify).toHaveBeenCalledTimes(1);
      expect(jwtService.verify).toHaveBeenCalledWith(
        RefreshTokenValueObjectStub().value,
        {
          secret: 'TOKENS_SECRET',
        },
      );
    });

    it('should call configService get', () => {
      expect(configService.get).toHaveBeenCalledTimes(1);
      expect(configService.get).toHaveBeenCalledWith('JWT_REFRESH_SECRET');
    });

    it('should return null', () => {
      expect(response).toEqual(null);
    });
  });
});
