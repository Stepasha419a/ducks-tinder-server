import { Test } from '@nestjs/testing';
import { FilesModule } from 'files/files.module';
import { ShortUser } from 'apps/user/src/users.interface';
import { FilesService } from 'files/files.service';
import { PrismaModule } from '@app/common/database/database.module';
import { PrismaService } from '@app/common/database/database.service';
import { FilesServiceMock, UsersPrismaMock } from 'apps/user/src/test/mocks';
import { DELETE_PICTURE_DTO } from 'apps/user/src/test/values/users.const.dto';
import { DeletePictureCommandHandler } from './delete-picture.command-handler';
import { DeletePictureCommand } from './delete-picture.command';
import { requestUserStub, userDtoStub } from 'apps/user/src/test/stubs';
import { UsersSelector } from 'apps/user/src/infrastructure/repository/user.selector';

describe('when delete picture is called', () => {
  let prismaService: PrismaService;
  let filesService: FilesService;
  let deletePictureCommandHandler: DeletePictureCommandHandler;

  let user: ShortUser;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [DeletePictureCommandHandler],
      imports: [FilesModule, PrismaModule],
    })
      .overrideProvider(FilesService)
      .useValue(FilesServiceMock())
      .overrideProvider(PrismaService)
      .useValue(UsersPrismaMock())
      .compile();

    prismaService = moduleRef.get<PrismaService>(PrismaService);
    filesService = moduleRef.get<FilesService>(FilesService);
    deletePictureCommandHandler = moduleRef.get<DeletePictureCommandHandler>(
      DeletePictureCommandHandler,
    );
  });

  describe('when it is called correctly', () => {
    beforeAll(() => {
      prismaService.user.findUnique = jest.fn().mockResolvedValue({
        ...userDtoStub(),
        pairs: [userDtoStub().firstPair],
      });
      prismaService.user.count = jest.fn().mockResolvedValue(5);
      prismaService.picture.findFirst = jest.fn().mockResolvedValue({
        id: '123123',
        name: '123.jpg',
        userId: userDtoStub().id,
        order: 0,
      });
      prismaService.picture.findMany = jest.fn().mockResolvedValue([
        {
          id: '123123',
          name: '123.jpg',
          userId: userDtoStub().id,
          order: 0,
        },
        {
          id: '456456',
          name: '456.jpg',
          userId: userDtoStub().id,
          order: 1,
        },
      ]);
    });

    beforeEach(async () => {
      jest.clearAllMocks();
      user = await deletePictureCommandHandler.execute(
        new DeletePictureCommand(requestUserStub(), DELETE_PICTURE_DTO),
      );
    });

    it('should call picture find first', () => {
      expect(prismaService.picture.findFirst).toBeCalledTimes(1);
      expect(prismaService.picture.findFirst).toBeCalledWith({
        where: DELETE_PICTURE_DTO,
      });
    });

    it('should call files-service delete picture', () => {
      expect(filesService.deletePicture).toBeCalledTimes(1);
      expect(filesService.deletePicture).toBeCalledWith(
        '123.jpg',
        userDtoStub().id,
      );
    });

    it('should call picture delete', () => {
      expect(prismaService.picture.delete).toBeCalledTimes(1);
      expect(prismaService.picture.delete).toBeCalledWith({
        where: { id: userDtoStub().pictures[0].id },
      });
    });

    it('should call picture update', () => {
      expect(prismaService.picture.update).toBeCalledTimes(1);
      expect(prismaService.picture.update).toBeCalledWith({
        where: { id: userDtoStub().pictures[1].id },
        data: { order: 0 },
      });
    });

    it('should call user find unique', () => {
      expect(prismaService.user.findUnique).toBeCalledTimes(1);
      expect(prismaService.user.findUnique).toBeCalledWith({
        where: { id: userDtoStub().id },
        include: UsersSelector.selectUser(),
      });
    });

    it('should call user count', () => {
      expect(prismaService.user.count).toBeCalledTimes(1);
      expect(prismaService.user.count).toBeCalledWith({
        where: { pairFor: { some: { id: user.id } } },
      });
    });

    it('should return a user', () => {
      expect(user).toEqual(userDtoStub());
    });
  });
});
