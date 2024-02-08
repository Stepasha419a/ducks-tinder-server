import { Test } from '@nestjs/testing';
import { CreateUserCommandHandler } from './create-user.command-handler';
import { CreateUserCommand } from './create-user.command';
import { UserRepository } from 'apps/user/src/domain/user/repository';
import { UserRepositoryMock } from 'apps/user/src/test/user/mock';
import { UserAggregateStub, UserStub } from 'apps/user/src/test/user/stub';

jest.mock('apps/user/src/domain', () => ({
  UserAggregate: jest.fn(),
}));

import { UserAggregate } from 'apps/user/src/domain/user';

describe('when delete pair is called', () => {
  let repository: UserRepository;
  let createUserCommandHandler: CreateUserCommandHandler;
  const userStub = UserStub();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateUserCommandHandler,
        { provide: UserRepository, useValue: UserRepositoryMock() },
      ],
    }).compile();

    repository = moduleRef.get<UserRepository>(UserRepository);
    createUserCommandHandler = moduleRef.get<CreateUserCommandHandler>(
      CreateUserCommandHandler,
    );
  });

  describe('when it is called correctly', () => {
    let response: UserAggregate;

    beforeEach(async () => {
      jest.clearAllMocks();

      UserAggregate.create = jest.fn().mockReturnValue(UserAggregateStub());
      repository.save = jest.fn().mockResolvedValue(UserAggregateStub());

      response = await createUserCommandHandler.execute(
        new CreateUserCommand({
          activationLink: userStub.activationLink,
          email: userStub.email,
          name: userStub.name,
          password: userStub.password,
        }),
      );
    });

    it('should call repository save', () => {
      expect(repository.save).toHaveBeenCalledTimes(1);

      const calledWithArg = (repository.save as jest.Mock).mock.calls[0][0];
      expect(JSON.parse(JSON.stringify(calledWithArg))).toEqual(
        JSON.parse(JSON.stringify(UserAggregateStub())),
      );
    });

    it('should return userAggregate', () => {
      expect(JSON.parse(JSON.stringify(response))).toEqual(
        JSON.parse(JSON.stringify(UserAggregateStub())),
      );
    });
  });

  describe('when there is some error occurred', () => {
    let response: UserAggregate;
    let error;

    beforeEach(async () => {
      jest.clearAllMocks();

      repository.save = jest.fn().mockImplementation(() => {
        throw new Error('User is not valid');
      });

      try {
        response = await createUserCommandHandler.execute(
          new CreateUserCommand({
            activationLink: userStub.activationLink,
            email: userStub.email,
            name: userStub.name,
            password: userStub.password,
          }),
        );
      } catch (responseError) {
        error = responseError;
      }
    });

    it('should call repository save', () => {
      expect(repository.save).toHaveBeenCalledTimes(1);

      const calledWithArg = (repository.save as jest.Mock).mock.calls[0][0];
      expect(JSON.parse(JSON.stringify(calledWithArg))).toEqual(
        JSON.parse(JSON.stringify(UserAggregateStub())),
      );
    });

    it('should return undefined', () => {
      expect(response).toEqual(undefined);
    });

    it('should throw an error', () => {
      expect(error?.message).toEqual('User is not valid');
    });
  });
});
