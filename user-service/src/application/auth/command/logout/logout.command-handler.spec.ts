import { Test } from '@nestjs/testing';
import { LogoutCommandHandler } from './logout.command-handler';
import { LogoutCommand } from './logout.command';
import { HttpStatus } from '@nestjs/common';
import { TokenFacade } from '../../../token';
import { TokenFacadeMock } from 'src/test/mock';

describe('when logout is called', () => {
  let tokenFacade: TokenFacade;
  let logoutCommandHandler: LogoutCommandHandler;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        LogoutCommandHandler,
        { provide: TokenFacade, useValue: TokenFacadeMock() },
      ],
    }).compile();

    tokenFacade = moduleRef.get<TokenFacade>(TokenFacade);
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

    it('should call tokenFacade removeToken', () => {
      expect(tokenFacade.commands.removeToken).toHaveBeenCalledWith(
        'refresh-token-value',
      );
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

    it('should not call tokenFacade removeToken', () => {
      expect(tokenFacade.commands.removeToken).not.toHaveBeenCalled();
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
