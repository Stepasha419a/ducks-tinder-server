import { Test } from '@nestjs/testing';
import { RemoveTokenCommandHandler } from './remove-token.command-handler';
import { RemoveTokenCommand } from './remove-token.command';
import { HttpStatus } from '@nestjs/common';
import { RefreshTokenRepository } from 'auth/domain/repository';
import { RefreshTokenRepositoryMock } from 'auth/test/mock';
import { RefreshTokenValueObjectStub } from 'auth/test/stub';

describe('when removeToken is called', () => {
  let repository: RefreshTokenRepository;

  let removeTokenCommandHandler: RemoveTokenCommandHandler;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RemoveTokenCommandHandler,
        {
          provide: RefreshTokenRepository,
          useValue: RefreshTokenRepositoryMock(),
        },
      ],
    }).compile();

    repository = moduleRef.get<RefreshTokenRepository>(RefreshTokenRepository);
    removeTokenCommandHandler = moduleRef.get<RemoveTokenCommandHandler>(
      RemoveTokenCommandHandler,
    );
  });

  describe('when it is called correctly', () => {
    let response;

    beforeEach(async () => {
      jest.clearAllMocks();

      repository.findOneByValue = jest
        .fn()
        .mockResolvedValue(RefreshTokenValueObjectStub());
      repository.delete = jest.fn().mockResolvedValue(true);

      response = await removeTokenCommandHandler.execute(
        new RemoveTokenCommand(RefreshTokenValueObjectStub().value),
      );
    });

    it('should call repository findOneByValue', () => {
      expect(repository.findOneByValue).toBeCalledTimes(1);
      expect(repository.findOneByValue).toHaveBeenCalledWith(
        RefreshTokenValueObjectStub().value,
      );
    });

    it('should call repository delete', () => {
      expect(repository.delete).toBeCalledTimes(1);
      expect(repository.delete).toHaveBeenCalledWith(
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

      repository.findOneByValue = jest.fn().mockResolvedValue(false);
      repository.delete = jest.fn().mockResolvedValue(true);

      try {
        response = await removeTokenCommandHandler.execute(
          new RemoveTokenCommand(RefreshTokenValueObjectStub().value),
        );
      } catch (responseError) {
        error = responseError;
      }
    });

    it('should call repository findOneByValue', () => {
      expect(repository.findOneByValue).toBeCalledTimes(1);
      expect(repository.findOneByValue).toHaveBeenCalledWith(
        RefreshTokenValueObjectStub().value,
      );
    });

    it('should not call repository delete', () => {
      expect(repository.delete).not.toBeCalled();
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
