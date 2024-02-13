import { Test } from '@nestjs/testing';
import { LogoutCommandHandler } from './logout.command-handler';
import { LogoutCommand } from './logout.command';
import { HttpStatus } from '@nestjs/common';
import { TokenAdapter } from 'apps/user/src/application/token';
import { TokenAdapterMock } from 'apps/user/src/test/mock';

describe('when logout is called', () => {
  let tokenAdapter: TokenAdapter;
  let logoutCommandHandler: LogoutCommandHandler;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        LogoutCommandHandler,
        { provide: TokenAdapter, useValue: TokenAdapterMock() },
      ],
    }).compile();

    tokenAdapter = moduleRef.get<TokenAdapter>(TokenAdapter);
    logoutCommandHandler =
      moduleRef.get<LogoutCommandHandler>(LogoutCommandHandler);
  });

  describe('when it is called correctly', () => {
    let response;

    beforeEach(async () => {
      jest.clearAllMocks();
      response = await logoutCommandHandler.execute(
        new LogoutCommand('refresh-token-value'),
      );
    });

    it('should call tokenAdapter removeToken', () => {
      expect(tokenAdapter.removeToken).toBeCalledWith('refresh-token-value');
    });

    it('should return undefined', () => {
      expect(response).toEqual(undefined);
    });
  });

  describe('when there is no refreshTokenValue', () => {
    let response;
    let error;

    beforeEach(async () => {
      jest.clearAllMocks();
      try {
        response = await logoutCommandHandler.execute(
          new LogoutCommand(undefined),
        );
      } catch (responseError) {
        error = responseError;
      }
    });

    it('should not call tokenAdapter removeToken', () => {
      expect(tokenAdapter.removeToken).not.toBeCalled();
    });

    it('should return undefined', () => {
      expect(response).toEqual(undefined);
    });

    it('should throw an error', () => {
      expect(error?.message).toEqual('Unauthorized');
      expect(error?.status).toEqual(HttpStatus.UNAUTHORIZED);
    });
  });
});
