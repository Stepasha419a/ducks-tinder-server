import { Test } from '@nestjs/testing';
import { GenerateTokensCommandHandler } from './generate-tokens.command-handler';
import { JwtService } from '@nestjs/jwt';
import { GenerateTokensCommand } from './generate-tokens.command';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from 'user/domain/repository';
import {
  ConfigServiceMock,
  JwtServiceMock,
  UserRepositoryMock,
} from 'user/test/mock';
import {
  AccessTokenValueObjectStub,
  RefreshTokenValueObjectStub,
  UserStub,
} from 'user/test/stub';
import { RefreshTokenValueObject } from 'user/domain';

describe('when generateTokens is called', () => {
  let repository: UserRepository;
  let jwtService: JwtService;
  let configService: ConfigService;

  let generateTokensCommandHandler: GenerateTokensCommandHandler;

  beforeAll(async () => {
    jest.useFakeTimers().setSystemTime(new Date('02-02-2002'));

    const moduleRef = await Test.createTestingModule({
      providers: [
        GenerateTokensCommandHandler,
        { provide: UserRepository, useValue: UserRepositoryMock() },
        { provide: JwtService, useValue: JwtServiceMock() },
        { provide: ConfigService, useValue: ConfigServiceMock() },
      ],
    }).compile();

    repository = moduleRef.get<UserRepository>(UserRepository);
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
    expect(jwtService.sign).toBeCalledTimes(2);
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
    expect(repository.saveRefreshToken).toBeCalledTimes(1);
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
