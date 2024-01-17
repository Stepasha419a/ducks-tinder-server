import { Test } from '@nestjs/testing';
import { DislikeUserCommand } from './dislike-user.command';
import { DislikeUserCommandHandler } from './dislike-user.command-handler';
import { UserRepository } from 'apps/user/src/domain/repository';
import { UserRepositoryMock } from 'apps/user/src/test/mock';
import { UserAggregateStub, UserStub } from 'apps/user/src/test/stub';
import { HttpStatus } from '@nestjs/common';
import { USER_ALREADY_CHECKED } from '@app/common/constants/error';

describe('when dislike user is called', () => {
  let repository: UserRepository;
  let dislikeUserCommandHandler: DislikeUserCommandHandler;
  const pairId = '34545656';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        DislikeUserCommandHandler,
        { provide: UserRepository, useValue: UserRepositoryMock() },
      ],
    }).compile();

    repository = moduleRef.get<UserRepository>(UserRepository);
    dislikeUserCommandHandler = moduleRef.get<DislikeUserCommandHandler>(
      DislikeUserCommandHandler,
    );
  });

  describe('when it is called correctly', () => {
    beforeAll(() => {
      repository.findOne = jest.fn().mockResolvedValue(UserAggregateStub());
      repository.findCheckedUserIds = jest.fn().mockResolvedValue([]);
    });

    let response;

    beforeEach(async () => {
      jest.clearAllMocks();
      response = await dislikeUserCommandHandler.execute(
        new DislikeUserCommand(UserStub().id, pairId),
      );
    });

    it('should call repository findOne', () => {
      expect(repository.findOne).toBeCalledTimes(1);
      expect(repository.findOne).toBeCalledWith(pairId);
    });

    it('should call repository findCheckedUserIds', () => {
      expect(repository.findCheckedUserIds).toBeCalledTimes(1);
      expect(repository.findCheckedUserIds).toBeCalledWith(
        UserStub().id,
        pairId,
      );
    });

    it('should call repository makeChecked', () => {
      expect(repository.makeChecked).toBeCalledTimes(1);
      expect(repository.makeChecked).toBeCalledWith(pairId, UserStub().id);
    });

    it('should return undefined', () => {
      expect(response).toEqual(undefined);
    });
  });

  describe('when there is no such user', () => {
    beforeAll(() => {
      repository.findOne = jest.fn().mockResolvedValue(null);
      repository.findCheckedUserIds = jest.fn().mockResolvedValue([]);
    });

    let response;
    let error;

    beforeEach(async () => {
      jest.clearAllMocks();
      try {
        response = await dislikeUserCommandHandler.execute(
          new DislikeUserCommand(UserStub().id, pairId),
        );
      } catch (responseError) {
        error = responseError;
      }
    });

    it('should call repository findOne', () => {
      expect(repository.findOne).toBeCalledTimes(1);
      expect(repository.findOne).toBeCalledWith(pairId);
    });

    it('should not call repository findCheckedUserIds', () => {
      expect(repository.findCheckedUserIds).not.toBeCalled();
    });

    it('should call repository makeChecked', () => {
      expect(repository.makeChecked).not.toBeCalled();
    });

    it('should return undefined', () => {
      expect(response).toEqual(undefined);
    });

    it('should throw an error', () => {
      expect(error?.message).toEqual('Not Found');
      expect(error?.status).toEqual(HttpStatus.NOT_FOUND);
    });
  });

  describe('when there is already checked user', () => {
    beforeAll(() => {
      repository.findOne = jest.fn().mockResolvedValue(UserAggregateStub());
      repository.findCheckedUserIds = jest.fn().mockResolvedValue([pairId]);
    });

    let response;
    let error;

    beforeEach(async () => {
      jest.clearAllMocks();
      try {
        response = await dislikeUserCommandHandler.execute(
          new DislikeUserCommand(UserStub().id, pairId),
        );
      } catch (responseError) {
        error = responseError;
      }
    });

    it('should call repository findOne', () => {
      expect(repository.findOne).toBeCalledTimes(1);
      expect(repository.findOne).toBeCalledWith(pairId);
    });

    it('should call repository findCheckedUserIds', () => {
      expect(repository.findCheckedUserIds).toBeCalledTimes(1);
      expect(repository.findCheckedUserIds).toBeCalledWith(
        UserStub().id,
        pairId,
      );
    });

    it('should not call repository makeChecked', () => {
      expect(repository.makeChecked).not.toBeCalled();
    });

    it('should return undefined', () => {
      expect(response).toEqual(undefined);
    });

    it('should throw an error', () => {
      expect(error?.message).toEqual(USER_ALREADY_CHECKED);
      expect(error?.status).toEqual(HttpStatus.BAD_REQUEST);
    });
  });
});
