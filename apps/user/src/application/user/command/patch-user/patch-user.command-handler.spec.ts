import { Test } from '@nestjs/testing';
import { PatchUserCommandHandler } from './patch-user.command-handler';
import { PatchUserCommand } from './patch-user.command';
import { UserRepository } from 'apps/user/src/domain/user/repository';
import { UserAggregate } from 'apps/user/src/domain/user';
import { COMMON_ERROR } from '@app/common/shared/constant';
import { UserRepositoryMock } from 'apps/user/src/test/mock';
import { UserAggregateStub, UserStub } from 'apps/user/src/test/stub';

describe('when patch is called', () => {
  let repository: UserRepository;
  let patchUserCommandHandler: PatchUserCommandHandler;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PatchUserCommandHandler,
        { provide: UserRepository, useValue: UserRepositoryMock() },
      ],
    }).compile();

    patchUserCommandHandler = moduleRef.get<PatchUserCommandHandler>(
      PatchUserCommandHandler,
    );
    repository = moduleRef.get<UserRepository>(UserRepository);
  });

  describe('when it is called correctly', () => {
    beforeAll(() => {
      repository.findOne = jest.fn().mockResolvedValue(UserAggregateStub());
      repository.findOneByEmail = jest.fn().mockResolvedValue(undefined);
      repository.save = jest.fn().mockResolvedValue(UserAggregateStub());
    });

    const dto = {
      name: 'William',
      email: 'email123123@gmail.com',
    };

    let response: UserAggregate;

    beforeEach(async () => {
      jest.clearAllMocks();

      response = await patchUserCommandHandler.execute(
        new PatchUserCommand(UserStub().id, dto),
      );
    });

    it('should call repository findOne', () => {
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith(UserStub().id);
    });

    it('should call repository findOneByEmail', () => {
      expect(repository.findOneByEmail).toHaveBeenCalledTimes(1);
      expect(repository.findOneByEmail).toHaveBeenCalledWith(dto.email);
    });

    it('should call repository save', () => {
      expect(repository.save).toHaveBeenCalledTimes(1);

      const calledWithArg = (repository.save as jest.Mock).mock.calls[0][0];
      expect(JSON.parse(JSON.stringify(calledWithArg))).toEqual(
        JSON.parse(JSON.stringify({ ...UserAggregateStub(), ...dto })),
      );
    });

    it('should return a user aggregate', () => {
      expect(JSON.parse(JSON.stringify(response))).toEqual(
        JSON.parse(JSON.stringify(UserAggregateStub())),
      );
    });
  });

  describe('when there is already used email address', () => {
    beforeAll(() => {
      repository.findOne = jest.fn().mockResolvedValue(UserAggregateStub());
      repository.findOneByEmail = jest
        .fn()
        .mockResolvedValue(UserAggregateStub());
      repository.save = jest.fn().mockResolvedValue(UserAggregateStub());
    });

    const dto = {
      name: 'William',
      email: 'email123123@gmail.com',
    };

    let response: UserAggregate;
    let error;

    beforeEach(async () => {
      jest.clearAllMocks();

      try {
        response = await patchUserCommandHandler.execute(
          new PatchUserCommand(UserStub().id, dto),
        );
      } catch (responseError) {
        error = responseError;
      }
    });

    it('should call repository findOne', () => {
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith(UserStub().id);
    });

    it('should call repository findOneByEmail', () => {
      expect(repository.findOneByEmail).toHaveBeenCalledTimes(1);
      expect(repository.findOneByEmail).toHaveBeenCalledWith(dto.email);
    });

    it('should not call repository save', () => {
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('should throw an error', () => {
      expect(error.status).toEqual(403);
      expect(error.message).toEqual(COMMON_ERROR.USER_ALREADY_EXISTS);
    });

    it('should return undefined', () => {
      expect(response).toEqual(undefined);
    });
  });
});
