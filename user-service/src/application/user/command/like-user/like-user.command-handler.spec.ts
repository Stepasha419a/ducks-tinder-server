import { Test } from '@nestjs/testing';
import { LikeUserCommandHandler } from './like-user.command-handler';
import { LikeUserCommand } from './like-user.command';
import { UserRepository } from 'src/domain/user/repository';
import { HttpStatus } from '@nestjs/common';
import { UserRepositoryMock } from 'src/test/mock';
import { UserAggregateStub, UserStub } from 'src/test/stub';
import { ERROR } from 'src/infrastructure/user/common/constant';

describe('when like user is called', () => {
  let repository: UserRepository;
  let likeUserCommandHandler: LikeUserCommandHandler;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        LikeUserCommandHandler,
        { provide: UserRepository, useValue: UserRepositoryMock() },
      ],
    }).compile();

    repository = moduleRef.get<UserRepository>(UserRepository);
    likeUserCommandHandler = moduleRef.get<LikeUserCommandHandler>(
      LikeUserCommandHandler,
    );
  });

  describe('when it is called correctly', () => {
    beforeAll(() => {
      repository.findOne = jest.fn().mockResolvedValue(UserAggregateStub());
      repository.findCheckedUserIds = jest.fn().mockResolvedValue([]);
    });

    let response;

    const userId = UserStub().id;
    const pairId = '34545656';

    beforeEach(async () => {
      jest.clearAllMocks();
      response = await likeUserCommandHandler.execute(
        new LikeUserCommand(userId, pairId),
      );
    });

    it('should call repository findOne', () => {
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith(pairId);
    });

    it('should call repository findCheckedUserIds', () => {
      expect(repository.findCheckedUserIds).toHaveBeenCalledTimes(1);
      expect(repository.findCheckedUserIds).toHaveBeenCalledWith(
        userId,
        pairId,
      );
    });

    it('should call repository createPair', () => {
      expect(repository.createPair).toHaveBeenCalledTimes(1);
      expect(repository.createPair).toHaveBeenCalledWith(userId, pairId);
    });

    it('should call repository makeChecked', () => {
      expect(repository.makeChecked).toHaveBeenCalledTimes(1);
      expect(repository.makeChecked).toHaveBeenCalledWith(pairId, userId);
    });

    it('should return undefined', () => {
      expect(response).toEqual(undefined);
    });
  });

  describe('when there are same ids', () => {
    beforeAll(() => {
      repository.findOne = jest.fn().mockResolvedValue(UserAggregateStub());
      repository.findCheckedUserIds = jest.fn().mockResolvedValue([]);
    });

    let response;
    let error;

    const userId = '34545656';
    const pairId = '34545656';

    beforeEach(async () => {
      jest.clearAllMocks();
      try {
        response = await likeUserCommandHandler.execute(
          new LikeUserCommand(userId, pairId),
        );
      } catch (responseError) {
        error = responseError;
      }
    });

    it('should not call repository findOne', () => {
      expect(repository.findOne).not.toHaveBeenCalled();
    });

    it('should not call repository findCheckedUserIds', () => {
      expect(repository.findCheckedUserIds).not.toHaveBeenCalled();
    });

    it('should not call repository createPair', () => {
      expect(repository.createPair).not.toHaveBeenCalled();
    });

    it('should not call repository makeChecked', () => {
      expect(repository.makeChecked).not.toHaveBeenCalled();
    });

    it('should throw an error', () => {
      expect(error?.message).toEqual(ERROR.CAN_NOT_LIKE_YOURSELF);
      expect(error?.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it('should return undefined', () => {
      expect(response).toEqual(undefined);
    });
  });

  describe('when there is no such pair', () => {
    beforeAll(() => {
      repository.findOne = jest.fn().mockResolvedValue(undefined);
      repository.findCheckedUserIds = jest.fn().mockResolvedValue([]);
    });

    let response;
    let error;

    const userId = UserStub().id;
    const pairId = '34545656';

    beforeEach(async () => {
      jest.clearAllMocks();
      try {
        response = await likeUserCommandHandler.execute(
          new LikeUserCommand(userId, pairId),
        );
      } catch (responseError) {
        error = responseError;
      }
    });

    it('should call repository findOne', () => {
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith(pairId);
    });

    it('should not call repository findCheckedUserIds', () => {
      expect(repository.findCheckedUserIds).not.toHaveBeenCalled();
    });

    it('should not call repository createPair', () => {
      expect(repository.createPair).not.toHaveBeenCalled();
    });

    it('should not call repository makeChecked', () => {
      expect(repository.makeChecked).not.toHaveBeenCalled();
    });

    it('should throw an error', () => {
      expect(error?.message).toEqual('Not Found');
      expect(error?.status).toEqual(HttpStatus.NOT_FOUND);
    });

    it('should return undefined', () => {
      expect(response).toEqual(undefined);
    });
  });

  describe('when there is checked user', () => {
    const userId = UserStub().id;

    beforeAll(() => {
      repository.findOne = jest.fn().mockResolvedValue(UserAggregateStub());
      repository.findCheckedUserIds = jest.fn().mockResolvedValue([userId]);
    });

    let response;
    let error;

    const pairId = '34545656';

    beforeEach(async () => {
      jest.clearAllMocks();
      try {
        response = await likeUserCommandHandler.execute(
          new LikeUserCommand(userId, pairId),
        );
      } catch (responseError) {
        error = responseError;
      }
    });

    it('should call repository findOne', () => {
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith(pairId);
    });

    it('should call repository findCheckedUserIds', () => {
      expect(repository.findCheckedUserIds).toHaveBeenCalledTimes(1);
      expect(repository.findCheckedUserIds).toHaveBeenCalledWith(
        userId,
        pairId,
      );
    });

    it('should not call repository createPair', () => {
      expect(repository.createPair).not.toHaveBeenCalled();
    });

    it('should not call repository makeChecked', () => {
      expect(repository.makeChecked).not.toHaveBeenCalled();
    });

    it('should throw an error', () => {
      expect(error?.message).toEqual(ERROR.USER_ALREADY_CHECKED);
      expect(error?.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it('should return undefined', () => {
      expect(response).toEqual(undefined);
    });
  });
});
