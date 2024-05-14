import { Test } from '@nestjs/testing';
import { MixPicturesCommandHandler } from './mix-pictures.command-handler';
import { MixPicturesCommand } from './mix-pictures.command';
import { UserRepository } from 'user-service/src/domain/user/repository';
import { HttpStatus } from '@nestjs/common';
import { UserRepositoryMock } from 'user-service/src/test/mock';
import { UserAggregateStub, UserStub } from 'user-service/src/test/stub';

describe('when mix pictures is called', () => {
  let repository: UserRepository;
  let mixPicturesCommandHandler: MixPicturesCommandHandler;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        MixPicturesCommandHandler,
        { provide: UserRepository, useValue: UserRepositoryMock() },
      ],
    }).compile();

    repository = moduleRef.get<UserRepository>(UserRepository);
    mixPicturesCommandHandler = moduleRef.get<MixPicturesCommandHandler>(
      MixPicturesCommandHandler,
    );
  });

  describe('when it is called correctly', () => {
    const userAggregate = UserAggregateStub();

    beforeAll(() => {
      repository.findOne = jest.fn().mockResolvedValue(userAggregate);
      repository.save = jest.fn().mockResolvedValue(UserAggregateStub());
    });

    const dto = { pictureOrders: [0, 1] };

    let response;

    beforeEach(async () => {
      jest.clearAllMocks();
      response = await mixPicturesCommandHandler.execute(
        new MixPicturesCommand(UserStub().id, dto),
      );
    });

    it('should call repository findOne', () => {
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith(UserStub().id);
    });

    it('should call userAggregate mixPictureOrders', () => {
      expect(userAggregate.mixPictureOrders).toHaveBeenCalledTimes(1);
      expect(userAggregate.mixPictureOrders).toHaveBeenCalledWith(
        dto.pictureOrders,
      );
    });

    it('should call repository save', () => {
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith(userAggregate);
    });

    it('should return a user aggregate', () => {
      expect(JSON.parse(JSON.stringify(response))).toEqual(
        JSON.parse(JSON.stringify(UserAggregateStub())),
      );
    });
  });

  describe('when there is no such pictures length', () => {
    const userAggregate = UserAggregateStub();

    beforeAll(() => {
      repository.findOne = jest.fn().mockResolvedValue(userAggregate);
      repository.save = jest.fn().mockResolvedValue(UserAggregateStub());
    });

    const dto = { pictureOrders: [0, 1, 2] };

    let error;
    let response;

    beforeEach(async () => {
      jest.clearAllMocks();
      try {
        response = await mixPicturesCommandHandler.execute(
          new MixPicturesCommand(UserStub().id, dto),
        );
      } catch (responseError) {
        error = responseError;
      }
    });

    it('should call repository findOne', () => {
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith(UserStub().id);
    });

    it('should not call userAggregate mixPictureOrders', () => {
      expect(userAggregate.mixPictureOrders).not.toHaveBeenCalled();
    });

    it('should not call repository save', () => {
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('should throw an error', () => {
      expect(error?.message).toEqual('Not Found');
      expect(error?.status).toEqual(HttpStatus.NOT_FOUND);
    });

    it('should return undefined', () => {
      expect(response).toEqual(undefined);
    });
  });
});
