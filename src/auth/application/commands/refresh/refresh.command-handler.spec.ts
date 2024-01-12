import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from 'users/users.service';
import { UsersModule } from 'users/users.module';
import { TokensService } from 'tokens/tokens.service';
import { TokensModule } from 'tokens/tokens.module';
import { TokensServiceMock, UsersServiceMock } from 'auth/test/mocks';
import { AuthDataReturn } from 'auth/auth.interface';
import { RefreshCommand } from './refresh.command';
import { userDataStub } from 'auth/test/stubs';
import { userDtoStub } from 'users/test/stubs';
import { RefreshCommandHandler } from './refresh.command-handler';

describe('when refresh is called', () => {
  let tokensService: TokensService;
  let usersService: UsersService;
  let refreshCommandHandler: RefreshCommandHandler;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [RefreshCommandHandler],
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: `.env.${process.env.NODE_ENV}`,
        }),
        UsersModule,
        TokensModule,
      ],
    })
      .overrideProvider(UsersService)
      .useValue(UsersServiceMock())
      .overrideProvider(TokensService)
      .useValue(TokensServiceMock())
      .compile();

    tokensService = moduleRef.get<TokensService>(TokensService);
    usersService = moduleRef.get<UsersService>(UsersService);
    refreshCommandHandler = moduleRef.get<RefreshCommandHandler>(
      RefreshCommandHandler,
    );
  });

  let data: AuthDataReturn;

  describe('when it is called correctly', () => {
    beforeAll(async () => {
      usersService.getUser = jest.fn().mockResolvedValue(userDtoStub());
      tokensService.generateTokens = jest.fn().mockResolvedValue({
        refreshToken: userDataStub().refreshToken,
        accessToken: userDataStub().data.accessToken,
      });
      tokensService.validateRefreshToken = jest.fn().mockResolvedValue({
        id: userDtoStub().id,
      });
    });

    beforeEach(async () => {
      jest.clearAllMocks();
      data = await refreshCommandHandler.execute(
        new RefreshCommand(userDataStub().refreshToken),
      );
    });

    it('should call tokensService validateRefreshToken', () => {
      expect(tokensService.validateRefreshToken).toBeCalledWith(
        userDataStub().refreshToken,
      );
    });

    it('should call usersService getUser', () => {
      expect(usersService.getUser).toBeCalledWith(userDtoStub().id);
    });

    it('should call tokensService generateTokens', () => {
      expect(tokensService.generateTokens).toBeCalledWith({
        id: userDtoStub().id,
        email: userDtoStub().email,
      });
    });

    it('should return userData', () => {
      expect(data).toEqual(userDataStub());
    });
  });
});
