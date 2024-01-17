import { Test } from '@nestjs/testing';
import { CreateUserCommandHandler } from './create-user.command-handler';
import { CreateUserCommand } from './create-user.command';
import { UserRepository } from 'user/domain/repository';
import { UserRepositoryMock } from 'user/test/mock';
import { UserAggregateStub } from 'user/test/stub';
import { UserAggregate } from 'user/domain';

describe('when delete pair is called', () => {
  let repository: UserRepository;
  let createUserCommandHandler: CreateUserCommandHandler;
  const userAggregate = UserAggregateStub();

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

      repository.save = jest.fn().mockResolvedValue(UserAggregateStub());

      response = await createUserCommandHandler.execute(
        new CreateUserCommand({
          activationLink: userAggregate.activationLink,
          email: userAggregate.email,
          name: userAggregate.name,
          password: userAggregate.password,
        }),
      );
    });

    it('should call repository save', () => {
      // TODO: implement stub to have methods otherwise implement user aggregate nullable fields
      expect(repository.save).toBeCalledTimes(1);
      //expect(repository.save).toBeCalledWith(UserAggregateStub());
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
            activationLink: userAggregate.activationLink,
            email: userAggregate.email,
            name: userAggregate.name,
            password: userAggregate.password,
          }),
        );
      } catch (responseError) {
        console.log(responseError);
        error = responseError;
      }
    });

    it('should call repository save', () => {
      // TODO: implement stub to have methods otherwise implement user aggregate nullable fields
      expect(repository.save).toBeCalledTimes(1);
      //expect(repository.save).toBeCalledWith(UserAggregateStub());
    });

    it('should return undefined', () => {
      expect(response).toEqual(undefined);
    });

    it('should throw an error', () => {
      expect(error?.message).toEqual('User is not valid');
    });
  });
});
