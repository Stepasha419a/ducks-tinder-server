import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  ConfigServiceMock,
  JwtServiceMock,
} from 'apps/user/src/test/auth/mock';
import {
  AccessTokenValueObjectStub,
  UserStub,
} from 'apps/user/src/test/auth/stub';
import { UserTokenDto } from 'apps/user/src/application/auth/adapter/token';
import { ValidateAccessTokenQueryHandler } from './validate-access-token.query-handler';
import { ValidateAccessTokenQuery } from './validate-access-token.query';

describe('when validateAccessToken is called', () => {
  let jwtService: JwtService;
  let configService: ConfigService;

  let validateAccessTokenQueryHandler: ValidateAccessTokenQueryHandler;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ValidateAccessTokenQueryHandler,
        { provide: JwtService, useValue: JwtServiceMock() },
        { provide: ConfigService, useValue: ConfigServiceMock() },
      ],
    }).compile();

    jwtService = moduleRef.get<JwtService>(JwtService);
    configService = moduleRef.get<ConfigService>(ConfigService);
    validateAccessTokenQueryHandler =
      moduleRef.get<ValidateAccessTokenQueryHandler>(
        ValidateAccessTokenQueryHandler,
      );
  });

  describe('when it is called correctly', () => {
    let response;

    beforeEach(async () => {
      jest.clearAllMocks();

      configService.get = jest.fn().mockReturnValue('TOKENS_SECRET');
      jwtService.verify = jest.fn().mockResolvedValue({
        email: UserStub().email,
        userId: UserStub().id,
      } as UserTokenDto);

      response = await validateAccessTokenQueryHandler.execute(
        new ValidateAccessTokenQuery(AccessTokenValueObjectStub().value),
      );
    });

    it('should call jwtService verify', () => {
      expect(jwtService.verify).toHaveBeenCalledTimes(1);
      expect(jwtService.verify).toHaveBeenCalledWith(
        AccessTokenValueObjectStub().value,
        {
          secret: 'TOKENS_SECRET',
        },
      );
    });

    it('should call configService get', () => {
      expect(configService.get).toHaveBeenCalledTimes(1);
      expect(configService.get).toHaveBeenCalledWith('JWT_ACCESS_SECRET');
    });

    it('should return tokenData', () => {
      expect(response).toEqual({
        email: UserStub().email,
        userId: UserStub().id,
      });
    });
  });

  describe('when there is no valid token', () => {
    let response;

    beforeEach(async () => {
      jest.clearAllMocks();

      configService.get = jest.fn().mockReturnValue('TOKENS_SECRET');
      jwtService.verify = jest.fn().mockImplementation(() => {
        throw new Error('Token is not valid');
      });

      response = await validateAccessTokenQueryHandler.execute(
        new ValidateAccessTokenQuery(AccessTokenValueObjectStub().value),
      );
    });

    it('should call jwtService verify', () => {
      expect(jwtService.verify).toHaveBeenCalledTimes(1);
      expect(jwtService.verify).toHaveBeenCalledWith(
        AccessTokenValueObjectStub().value,
        {
          secret: 'TOKENS_SECRET',
        },
      );
    });

    it('should call configService get', () => {
      expect(configService.get).toHaveBeenCalledTimes(1);
      expect(configService.get).toHaveBeenCalledWith('JWT_ACCESS_SECRET');
    });

    it('should return null', () => {
      expect(response).toEqual(null);
    });
  });
});
