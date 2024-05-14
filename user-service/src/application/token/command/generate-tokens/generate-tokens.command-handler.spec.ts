import { Test } from '@nestjs/testing';
import { GenerateTokensCommandHandler } from './generate-tokens.command-handler';
import { JwtService } from '@nestjs/jwt';
import { GenerateTokensCommand } from './generate-tokens.command';
import { ConfigService } from '@nestjs/config';
import {
  ConfigServiceMock,
  JwtServiceMock,
  TokenRepositoryMock,
} from 'user-service/src/test/mock';
import {
  AccessTokenValueObjectStub,
  RefreshTokenValueObjectStub,
  UserStub,
} from 'user-service/src/test/stub';
import { TokenRepository } from 'user-service/src/domain/token/repository';
import { RefreshTokenValueObject } from 'user-service/src/domain/token';

describe('when generateTokens is called', () => {
  let repository: TokenRepository;
  let jwtService: JwtService;
  let configService: ConfigService;

  let generateTokensCommandHandler: GenerateTokensCommandHandler;

  beforeAll(async () => {
    jest.useFakeTimers().setSystemTime(new Date('02-02-2002'));

    const moduleRef = await Test.createTestingModule({
      providers: [
        GenerateTokensCommandHandler,
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
    generateTokensCommandHandler = moduleRef.get<GenerateTokensCommandHandler>(
      GenerateTokensCommandHandler,
    );
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  let tokens;
  const dto = {
    email: UserStub().email,
    userId: UserStub().id,
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    configService.get = jest.fn().mockReturnValue('TOKENS_SECRET');
    jwtService.sign = jest
      .fn()
      .mockReturnValue(AccessTokenValueObjectStub().value);

    tokens = await generateTokensCommandHandler.execute(
      new GenerateTokensCommand(dto),
    );
  });

  it('should call jwtService sign', () => {
    expect(jwtService.sign).toHaveBeenCalledTimes(2);
    expect(jwtService.sign).toHaveBeenNthCalledWith(1, dto, {
      expiresIn: '60m',
      secret: 'TOKENS_SECRET',
    });
    expect(jwtService.sign).toHaveBeenNthCalledWith(2, dto, {
      expiresIn: '7d',
      secret: 'TOKENS_SECRET',
    });
  });

  it('should call repository saveRefreshToken', () => {
    expect(repository.saveRefreshToken).toHaveBeenCalledTimes(1);
    expect(repository.saveRefreshToken).toHaveBeenCalledWith(
      RefreshTokenValueObject.create({
        id: dto.userId,
        value: AccessTokenValueObjectStub().value,
      }),
    );
  });

  it('should return tokens', () => {
    expect(tokens).toEqual({
      accessTokenValueObject: AccessTokenValueObjectStub(),
      refreshTokenValueObject: RefreshTokenValueObjectStub(),
    });
  });
});
