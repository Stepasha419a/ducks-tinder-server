import { Test } from '@nestjs/testing';
import { RemoveTokenCommandHandler } from './remove-token.command-handler';
import { RemoveTokenCommand } from './remove-token.command';
import { HttpStatus } from '@nestjs/common';
import { TokenRepositoryMock } from 'apps/user/src/test/mock';
import { RefreshTokenValueObjectStub } from 'apps/user/src/test/stub';
import { TokenRepository } from 'apps/user/src/domain/token/repository';

describe('when removeToken is called', () => {
  let repository: TokenRepository;

  let removeTokenCommandHandler: RemoveTokenCommandHandler;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RemoveTokenCommandHandler,
        {
          provide: TokenRepository,
          useValue: TokenRepositoryMock(),
        },
      ],
    }).compile();

    repository = moduleRef.get<TokenRepository>(TokenRepository);
    removeTokenCommandHandler = moduleRef.get<RemoveTokenCommandHandler>(
      RemoveTokenCommandHandler,
    );
  });

  describe('when it is called correctly', () => {
    let response;

    beforeEach(async () => {
      jest.clearAllMocks();

      repository.findOneRefreshTokenByValue = jest
        .fn()
        .mockResolvedValue(RefreshTokenValueObjectStub());
      repository.deleteRefreshToken = jest.fn().mockResolvedValue(true);

      response = await removeTokenCommandHandler.execute(
        new RemoveTokenCommand(RefreshTokenValueObjectStub().value),
      );
    });

    it('should call repository findOneRefreshTokenByValue', () => {
      expect(repository.findOneRefreshTokenByValue).toBeCalledTimes(1);
      expect(repository.findOneRefreshTokenByValue).toHaveBeenCalledWith(
        RefreshTokenValueObjectStub().value,
      );
    });

    it('should call repository deleteRefreshToken', () => {
      expect(repository.deleteRefreshToken).toBeCalledTimes(1);
      expect(repository.deleteRefreshToken).toHaveBeenCalledWith(
        RefreshTokenValueObjectStub().id,
      );
    });

    it('should return undefined', () => {
      expect(response).toEqual(undefined);
    });
  });

  describe('when there is no existingRefreshToken', () => {
    let response;
    let error;

    beforeEach(async () => {
      jest.clearAllMocks();

      repository.findOneRefreshTokenByValue = jest
        .fn()
        .mockResolvedValue(false);
      repository.deleteRefreshToken = jest.fn().mockResolvedValue(true);

      try {
        response = await removeTokenCommandHandler.execute(
          new RemoveTokenCommand(RefreshTokenValueObjectStub().value),
        );
      } catch (responseError) {
        error = responseError;
      }
    });

    it('should call repository findOneRefreshTokenByValue', () => {
      expect(repository.findOneRefreshTokenByValue).toBeCalledTimes(1);
      expect(repository.findOneRefreshTokenByValue).toHaveBeenCalledWith(
        RefreshTokenValueObjectStub().value,
      );
    });

    it('should not call repository deleteRefreshToken', () => {
      expect(repository.deleteRefreshToken).not.toBeCalled();
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
