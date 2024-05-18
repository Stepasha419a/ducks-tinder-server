import { Test } from '@nestjs/testing';
import { DeletePairCommandHandler } from './delete-pair.command-handler';
import { DeletePairCommand } from './delete-pair.command';
import { UserRepository } from 'src/domain/user/repository';
import { HttpStatus } from '@nestjs/common';
import { UserRepositoryMock } from 'src/test/mock';
import { UserAggregateStub, UserStub } from 'src/test/stub';

describe('when delete pair is called', () => {
  let repository: UserRepository;
  let deletePairCommandHandler: DeletePairCommandHandler;
  const userPairId = '34545656';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        DeletePairCommandHandler,
        { provide: UserRepository, useValue: UserRepositoryMock() },
      ],
    }).compile();

    repository = moduleRef.get<UserRepository>(UserRepository);
    deletePairCommandHandler = moduleRef.get<DeletePairCommandHandler>(
      DeletePairCommandHandler,
    );
  });

  describe('when it is called correctly', () => {
    beforeAll(() => {
      repository.findPair = jest
        .fn()
        .mockResolvedValue({ ...UserAggregateStub(), id: userPairId });
    });

    let response: string;

    beforeEach(async () => {
      jest.clearAllMocks();
      response = await deletePairCommandHandler.execute(
        new DeletePairCommand(UserStub().id, userPairId),
      );
    });

    it('should call repository findPair', () => {
      expect(repository.findPair).toHaveBeenCalledTimes(1);
      expect(repository.findPair).toHaveBeenCalledWith(
        userPairId,
        UserStub().id,
      );
    });

    it('should call repository deletePair', () => {
      expect(repository.deletePair).toHaveBeenCalledTimes(1);
      expect(repository.deletePair).toHaveBeenCalledWith(
        userPairId,
        UserStub().id,
      );
    });

    it('should return deleted pair id', () => {
      expect(response).toEqual(userPairId);
    });
  });

  describe('when there is no pair', () => {
    beforeAll(() => {
      repository.findPair = jest.fn().mockResolvedValue(null);
    });

    let response: string;
    let error;

    beforeEach(async () => {
      jest.clearAllMocks();
      try {
        response = await deletePairCommandHandler.execute(
          new DeletePairCommand(UserStub().id, userPairId),
        );
      } catch (responseError) {
        error = responseError;
      }
    });

    it('should call repository findPair', () => {
      expect(repository.findPair).toHaveBeenCalledTimes(1);
      expect(repository.findPair).toHaveBeenCalledWith(
        userPairId,
        UserStub().id,
      );
    });

    it('should not call repository deletePair', () => {
      expect(repository.deletePair).not.toHaveBeenCalled();
    });

    it('should return undefined', () => {
      expect(response).toEqual(undefined);
    });

    it('should throw an error', () => {
      expect(error.message).toEqual('Not Found');
      expect(error.status).toEqual(HttpStatus.NOT_FOUND);
    });
  });
});
