import { Test } from '@nestjs/testing';
import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { User } from '@prisma/client';
import { UsersService } from 'users/users.service';
import { PrismaModule } from 'prisma/prisma.module';
import { PrismaService } from 'prisma/prisma.service';
import { UserDto } from 'users/legacy/dto';
import {
  UsersPrismaMock,
  CommandBusMock,
  QueryBusMock,
} from 'users/test/mocks';
import { userDtoStub } from 'users/test/stubs';
import { CREATE_USER_DTO } from 'users/test/values/users.const.dto';
import { CreateUserCommand } from 'users/commands';
import { GetUserByEmailQuery, GetUserQuery } from 'users/queries';

describe('users-service', () => {
  let service: UsersService;
  let commandBus: CommandBus;
  let queryBus: QueryBus;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UsersService],
      imports: [CqrsModule, PrismaModule],
    })
      .overrideProvider(PrismaService)
      .useValue(UsersPrismaMock())
      .overrideProvider(CommandBus)
      .useValue(CommandBusMock())
      .overrideProvider(QueryBus)
      .useValue(QueryBusMock())
      .compile();

    service = moduleRef.get<UsersService>(UsersService);
    commandBus = moduleRef.get<CommandBus>(CommandBus);
    queryBus = moduleRef.get<QueryBus>(QueryBus);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when service is ready', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('when get user is called', () => {
    let user: UserDto;

    beforeAll(() => {
      queryBus.execute = jest.fn().mockResolvedValue(userDtoStub());
    });

    beforeEach(async () => {
      user = await service.getUser(userDtoStub().id);
    });

    it('should call command bus execute', () => {
      expect(queryBus.execute).toBeCalledTimes(1);
      expect(queryBus.execute).toBeCalledWith(
        new GetUserQuery(userDtoStub().id),
      );
    });

    it('should return a short user', () => {
      expect(user).toEqual(userDtoStub());
    });
  });

  describe('when get by email is called', () => {
    let user: User;

    beforeAll(() => {
      queryBus.execute = jest.fn().mockResolvedValue(userDtoStub());
    });

    beforeEach(async () => {
      user = await service.getUserByEmail(userDtoStub().email);
    });

    it('should call command bus execute', () => {
      expect(queryBus.execute).toBeCalledTimes(1);
      expect(queryBus.execute).toBeCalledWith(
        new GetUserByEmailQuery(userDtoStub().email),
      );
    });

    it('should return a user', () => {
      expect(user).toEqual(userDtoStub());
    });
  });

  describe('when create user is called', () => {
    let user: UserDto;

    beforeAll(() => {
      commandBus.execute = jest.fn().mockResolvedValue(userDtoStub());
    });

    beforeEach(async () => {
      user = await service.createUser(CREATE_USER_DTO);
    });

    it('should call command bus execute', () => {
      expect(commandBus.execute).toBeCalledTimes(1);
      expect(commandBus.execute).toBeCalledWith(
        new CreateUserCommand(CREATE_USER_DTO),
      );
    });

    it('should return a user', () => {
      expect(user).toEqual(userDtoStub());
    });
  });
});
