import { Test } from '@nestjs/testing';
import { SavePictureCommandHandler } from './save-picture.command-handler';
import { SavePictureCommand } from './save-picture.command';
import { UserRepository } from 'src/domain/user/repository';
import { FileAdapterMock, UserRepositoryMock } from 'src/test/mock';
import { FileAdapter } from '../../adapter';
import {
  PictureValueObjectStub,
  UserAggregateStub,
  UserStub,
} from 'src/test/stub';
import { UserAggregate } from 'src/domain/user';

jest.mock('user-service/src/domain/user/value-object', () => ({
  PictureValueObject: jest.fn(),
}));

import { PictureValueObject } from 'user-service/src/domain/user/value-object';
import { ERROR } from 'src/infrastructure/user/common/constant';
import { HttpStatus } from '@nestjs/common';

describe('when save picture is called', () => {
  let repository: UserRepository;
  let fileAdapter: FileAdapter;
  let savePictureCommandHandler: SavePictureCommandHandler;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SavePictureCommandHandler,
        { provide: UserRepository, useValue: UserRepositoryMock() },
        { provide: FileAdapter, useValue: FileAdapterMock() },
      ],
    }).compile();

    repository = moduleRef.get<UserRepository>(UserRepository);
    fileAdapter = moduleRef.get<FileAdapter>(FileAdapter);
    savePictureCommandHandler = moduleRef.get<SavePictureCommandHandler>(
      SavePictureCommandHandler,
    );
  });

  describe('when it is called correctly', () => {
    const userAggregate = UserAggregateStub();
    beforeAll(() => {
      repository.findOne = jest.fn().mockResolvedValue(userAggregate);
      fileAdapter.savePicture = jest.fn().mockResolvedValue('picture-name');
      PictureValueObject.create = jest
        .fn()
        .mockReturnValue(PictureValueObjectStub());
      repository.save = jest.fn().mockResolvedValue(UserAggregateStub());
    });

    let response: UserAggregate;

    beforeEach(async () => {
      jest.clearAllMocks();
      response = await savePictureCommandHandler.execute(
        new SavePictureCommand(UserStub().id, {
          fieldname: '123123',
        } as Express.Multer.File),
      );
    });

    it('should call repository findOne', () => {
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith(UserStub().id);
    });

    it('should call fileAdapter savePicture', () => {
      expect(fileAdapter.savePicture).toHaveBeenCalledTimes(1);
      expect(fileAdapter.savePicture).toHaveBeenCalledWith(
        {
          fieldname: '123123',
        },
        UserStub().id,
      );
    });

    it('should call PictureValueObject create', () => {
      expect(PictureValueObject.create).toHaveBeenCalledTimes(1);
      expect(PictureValueObject.create).toHaveBeenCalledWith({
        name: 'picture-name',
        userId: UserStub().id,
        order: UserStub().pictures.length,
      });
    });

    it('should call userAggregate addPicture', () => {
      expect(userAggregate.addPicture).toHaveBeenCalledTimes(1);
      expect(userAggregate.addPicture).toHaveBeenCalledWith(
        PictureValueObjectStub(),
      );
    });

    it('should call repository save', () => {
      expect(repository.save).toHaveBeenCalledTimes(1);

      const calledWithArg = (repository.save as jest.Mock).mock.calls[0][0];
      expect(JSON.parse(JSON.stringify(calledWithArg))).toEqual(
        JSON.parse(JSON.stringify({ ...UserAggregateStub() })),
      );
    });

    it('should return a user aggregate', () => {
      expect(JSON.parse(JSON.stringify(response))).toEqual(
        JSON.parse(JSON.stringify(UserAggregateStub())),
      );
    });
  });

  describe('when there is max pictures count', () => {
    const userAggregate = UserAggregateStub();
    beforeAll(() => {
      repository.findOne = jest
        .fn()
        .mockResolvedValue({ ...userAggregate, pictures: new Array(9) });
      fileAdapter.savePicture = jest.fn().mockResolvedValue('picture-name');
      PictureValueObject.create = jest
        .fn()
        .mockReturnValue(PictureValueObjectStub());
      repository.save = jest.fn().mockResolvedValue(UserAggregateStub());
    });

    let response: UserAggregate;
    let error;

    beforeEach(async () => {
      jest.clearAllMocks();
      try {
        response = await savePictureCommandHandler.execute(
          new SavePictureCommand(UserStub().id, {
            fieldname: '123123',
          } as Express.Multer.File),
        );
      } catch (responseError) {
        error = responseError;
      }
    });

    it('should call repository findOne', () => {
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith(UserStub().id);
    });

    it('should not call fileAdapter savePicture', () => {
      expect(fileAdapter.savePicture).not.toHaveBeenCalled();
    });

    it('should not call PictureValueObject create', () => {
      expect(PictureValueObject.create).not.toHaveBeenCalled();
    });

    it('should not call userAggregate addPicture', () => {
      expect(userAggregate.addPicture).not.toHaveBeenCalled();
    });

    it('should not call repository save', () => {
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('should throw an error', () => {
      expect(error?.message).toEqual(ERROR.MAX_PICTURES_COUNT);
      expect(error?.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it('should return undefined', () => {
      expect(response).toEqual(undefined);
    });
  });
});
