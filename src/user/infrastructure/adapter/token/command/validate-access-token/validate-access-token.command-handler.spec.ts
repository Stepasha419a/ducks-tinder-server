import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ValidateAccessTokenCommand } from './validate-access-token.command';
import { ValidateAccessTokenCommandHandler } from './validate-access-token.command-handler';
import { ConfigServiceMock, JwtServiceMock } from 'user/test/mock';
import { UserTokenDto } from 'user/application/adapter';
import { AccessTokenValueObjectStub, UserStub } from 'user/test/stub';

describe('when validateAccessToken is called', () => {
  let jwtService: JwtService;
  let configService: ConfigService;

  let validateAccessTokenCommandHandler: ValidateAccessTokenCommandHandler;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ValidateAccessTokenCommandHandler,
        { provide: JwtService, useValue: JwtServiceMock() },
        { provide: ConfigService, useValue: ConfigServiceMock() },
      ],
    }).compile();

    jwtService = moduleRef.get<JwtService>(JwtService);
    configService = moduleRef.get<ConfigService>(ConfigService);
    validateAccessTokenCommandHandler =
      moduleRef.get<ValidateAccessTokenCommandHandler>(
        ValidateAccessTokenCommandHandler,
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

      response = await validateAccessTokenCommandHandler.execute(
        new ValidateAccessTokenCommand(AccessTokenValueObjectStub().value),
      );
    });

    it('should call jwtService verify', () => {
      expect(jwtService.verify).toBeCalledTimes(1);
      expect(jwtService.verify).toBeCalledWith(
        AccessTokenValueObjectStub().value,
        {
          secret: 'TOKENS_SECRET',
        },
      );
    });

    it('should call configService get', () => {
      expect(configService.get).toBeCalledTimes(1);
      expect(configService.get).toBeCalledWith('JWT_ACCESS_SECRET');
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

      response = await validateAccessTokenCommandHandler.execute(
        new ValidateAccessTokenCommand(AccessTokenValueObjectStub().value),
      );
    });

    it('should call jwtService verify', () => {
      expect(jwtService.verify).toBeCalledTimes(1);
      expect(jwtService.verify).toBeCalledWith(
        AccessTokenValueObjectStub().value,
        {
          secret: 'TOKENS_SECRET',
        },
      );
    });

    it('should call configService get', () => {
      expect(configService.get).toBeCalledTimes(1);
      expect(configService.get).toBeCalledWith('JWT_ACCESS_SECRET');
    });

    it('should return null', () => {
      expect(response).toEqual(null);
    });
  });
});
