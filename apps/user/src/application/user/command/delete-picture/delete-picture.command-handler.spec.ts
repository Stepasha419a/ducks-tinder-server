import { Test } from '@nestjs/testing';
import { DeletePictureCommandHandler } from './delete-picture.command-handler';
import { DeletePictureCommand } from './delete-picture.command';
import { UserRepository } from 'apps/user/src/domain/user/repository';
import { FileAdapter } from '../../adapter';
import { UserAggregate } from 'apps/user/src/domain/user';
import { UserAggregateStub, UserStub } from 'apps/user/src/test/stub';
import { FileAdapterMock, UserRepositoryMock } from 'apps/user/src/test/mock';

describe('when delete picture is called', () => {
  let repository: UserRepository;
  let fileAdapter: FileAdapter;
  let deletePictureCommandHandler: DeletePictureCommandHandler;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        DeletePictureCommandHandler,
        { provide: UserRepository, useValue: UserRepositoryMock() },
        { provide: FileAdapter, useValue: FileAdapterMock() },
      ],
    }).compile();

    repository = moduleRef.get<UserRepository>(UserRepository);
    fileAdapter = moduleRef.get<FileAdapter>(FileAdapter);
    deletePictureCommandHandler = moduleRef.get<DeletePictureCommandHandler>(
      DeletePictureCommandHandler,
    );
  });

  describe('when it is called correctly', () => {
    const userAggregate = UserAggregateStub();

    beforeAll(() => {
      repository.findOne = jest.fn().mockResolvedValue(userAggregate);
      repository.save = jest.fn().mockResolvedValue(UserAggregateStub());
    });

    let user: UserAggregate;
    const pictureToDelete = UserStub().pictures[0];

    beforeEach(async () => {
      jest.clearAllMocks();
      user = await deletePictureCommandHandler.execute(
        new DeletePictureCommand(UserStub().id, pictureToDelete.id),
      );
    });

    it('should call repository findOne', () => {
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith(UserStub().id);
    });

    it('should call fileAdapter deletePicture', () => {
      expect(fileAdapter.deletePicture).toHaveBeenCalledTimes(1);
      expect(fileAdapter.deletePicture).toHaveBeenCalledWith(
        pictureToDelete.name,
        UserStub().id,
      );
    });

    it('should call userAggregate deletePicture', () => {
      expect(userAggregate.deletePicture).toHaveBeenCalledTimes(1);
      expect(userAggregate.deletePicture).toHaveBeenCalledWith(
        pictureToDelete.id,
      );
    });

    it('should call userAggregate sortPictureOrders', () => {
      expect(userAggregate.sortPictureOrders).toHaveBeenCalledTimes(1);
      expect(userAggregate.sortPictureOrders).toHaveBeenCalledWith(
        pictureToDelete.order,
      );
    });

    it('should call repository save', () => {
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining(
          JSON.parse(JSON.stringify(UserAggregateStub())),
        ),
      );
    });

    it('should return a user', () => {
      expect(JSON.parse(JSON.stringify(user))).toEqual(
        JSON.parse(JSON.stringify(UserAggregateStub())),
      );
    });
  });
});
