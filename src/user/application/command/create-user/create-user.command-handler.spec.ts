import { Test } from '@nestjs/testing';
import { PrismaModule } from 'prisma/prisma.module';
import { PrismaService } from 'prisma/prisma.service';
import { UsersPrismaMock } from 'user/test/mocks';
import { userDtoStub } from 'user/test/stubs';
import { UsersSelector } from 'user/infrastructure/repository/user.selector';
import { CreateUserCommandHandler } from './create-user.command-handler';
import { CreateUserCommand } from './create-user.command';
import { CREATE_USER_DTO } from 'auth/test/values/auth.const.dto';
import { UserDto } from 'user/legacy/dto';

describe('when delete pair is called', () => {
  let prismaService: PrismaService;
  let createUserCommandHandler: CreateUserCommandHandler;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [CreateUserCommandHandler],
      imports: [PrismaModule],
    })
      .overrideProvider(PrismaService)
      .useValue(UsersPrismaMock())
      .compile();

    prismaService = moduleRef.get<PrismaService>(PrismaService);
    createUserCommandHandler = moduleRef.get<CreateUserCommandHandler>(
      CreateUserCommandHandler,
    );
  });

  describe('when it is called correctly', () => {
    beforeAll(() => {
      prismaService.user.create = jest.fn().mockResolvedValue({
        ...userDtoStub(),
        pairs: [userDtoStub().firstPair],
      });
      prismaService.user.count = jest.fn().mockResolvedValue(5);
    });

    let user: UserDto;

    beforeEach(async () => {
      jest.clearAllMocks();
      user = await createUserCommandHandler.execute(
        new CreateUserCommand(CREATE_USER_DTO),
      );
    });

    it('should call create user', () => {
      expect(prismaService.user.create).toBeCalledTimes(1);
      expect(prismaService.user.create).toBeCalledWith({
        data: CREATE_USER_DTO,
        include: UsersSelector.selectUser(),
      });
    });

    it('should call user count', () => {
      expect(prismaService.user.count).toBeCalledTimes(1);
      expect(prismaService.user.count).toBeCalledWith({
        where: { pairFor: { some: { email: CREATE_USER_DTO.email } } },
      });
    });

    it('should return a user', () => {
      expect(user).toEqual(userDtoStub());
    });
  });
});
