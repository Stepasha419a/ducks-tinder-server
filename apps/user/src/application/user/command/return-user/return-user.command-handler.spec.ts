import { Test } from '@nestjs/testing';
import { ReturnUserCommandHandler } from './return-user.command-handler';
import { ReturnUserCommand } from './return-user.command';
import { UserRepository } from 'apps/user/src/domain/user/repository';
import { UserRepositoryMock } from 'apps/user/src/test/user/mock';
import {
  UserCheckValueObjectStub,
  UserStub,
} from 'apps/user/src/test/user/stub';

describe('when return user is called', () => {
  let repository: UserRepository;
  let returnUserCommandHandler: ReturnUserCommandHandler;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ReturnUserCommandHandler,
        { provide: UserRepository, useValue: UserRepositoryMock() },
      ],
    }).compile();

    repository = moduleRef.get<UserRepository>(UserRepository);
    returnUserCommandHandler = moduleRef.get<ReturnUserCommandHandler>(
      ReturnUserCommandHandler,
    );
  });

  describe('when it is called correctly', () => {
    let response;

    beforeEach(async () => {
      jest.clearAllMocks();
      repository.findUserNotPairCheck = jest
        .fn()
        .mockResolvedValue(UserCheckValueObjectStub());

      response = await returnUserCommandHandler.execute(
        new ReturnUserCommand(UserStub().id),
      );
    });

    it('should call repository findUserNotPairCheck', () => {
      expect(repository.findUserNotPairCheck).toHaveBeenCalledTimes(1);
      expect(repository.findUserNotPairCheck).toHaveBeenCalledWith(
        UserStub().id,
      );
    });

    it('should call repository deleteUserCheck', () => {
      expect(repository.deleteUserCheck).toHaveBeenCalledTimes(1);
      expect(repository.deleteUserCheck).toHaveBeenCalledWith(
        UserCheckValueObjectStub().checkedId,
        UserCheckValueObjectStub().wasCheckedId,
      );
    });

    it('should return short user check', () => {
      expect(response).toEqual(UserCheckValueObjectStub());
    });
  });

  describe('when there is no checked user', () => {
    let response;
    let error;

    beforeEach(async () => {
      jest.clearAllMocks();
      repository.findUserNotPairCheck = jest.fn().mockResolvedValue(undefined);

      try {
        response = await returnUserCommandHandler.execute(
          new ReturnUserCommand(UserStub().id),
        );
      } catch (responseError) {
        error = responseError;
      }
    });

    it('should call repository findUserNotPairCheck', () => {
      expect(repository.findUserNotPairCheck).toHaveBeenCalledTimes(1);
      expect(repository.findUserNotPairCheck).toHaveBeenCalledWith(
        UserStub().id,
      );
    });

    it('should not call repository deleteUserCheck.', () => {
      expect(repository.deleteUserCheck).not.toHaveBeenCalled();
    });

    it('should throw an error', () => {
      expect(error.status).toEqual(404);
      expect(error.message).toEqual('Not Found');
    });

    it('should return undefined', () => {
      expect(response).toEqual(undefined);
    });
  });
});
