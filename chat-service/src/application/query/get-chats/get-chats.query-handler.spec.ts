import { Test } from '@nestjs/testing';
import { PrismaModule } from '@app/common/database/database.module';
import { PrismaService } from '@app/common/database/database.service';
import { requestUserStub } from 'user-service/src/test/stubs';
import { ChatsPrismaMock } from 'src/test/mocks';
import { GetChatsQuery } from './get-chats.query';
import { GetChatsQueryHandler } from './get-chats.query-handler';
import { ShortChat } from 'src/chats.interface';
import { UsersSelector } from 'user-service/src/infrastructure/repository/user.selector';
import { shortChatStub } from 'src/test/stubs';
import { ChatsSelector } from 'src/chats.selector';

describe('when get chats is called', () => {
  let prismaService: PrismaService;
  let getChatsQueryHandler: GetChatsQueryHandler;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [GetChatsQueryHandler],
      imports: [PrismaModule],
    })
      .overrideProvider(PrismaService)
      .useValue(ChatsPrismaMock())
      .compile();

    prismaService = moduleRef.get<PrismaService>(PrismaService);
    getChatsQueryHandler =
      moduleRef.get<GetChatsQueryHandler>(GetChatsQueryHandler);
  });

  describe('when it is called correctly', () => {
    beforeAll(() => {
      prismaService.chat.findMany = jest
        .fn()
        .mockResolvedValue([shortChatStub()]);
    });

    let chats: ShortChat[];

    beforeEach(async () => {
      jest.clearAllMocks();
      chats = await getChatsQueryHandler.execute(
        new GetChatsQuery(requestUserStub()),
      );
    });

    it('should call chat find many', () => {
      expect(prismaService.chat.findMany).toBeCalledTimes(1);
      expect(prismaService.chat.findMany).toBeCalledWith({
        where: { users: { some: { id: requestUserStub().id } } },
        select: {
          id: true,
          messages: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            select: ChatsSelector.selectMessage(),
          },
          users: {
            where: { id: { not: requestUserStub().id } },
            select: UsersSelector.selectShortUser(),
          },
          chatVisits: {
            select: {
              lastSeen: true,
            },
            where: {
              userId: requestUserStub().id,
            },
          },
          blocked: true,
          blockedById: true,
        },
      });
    });

    it('should return an array of chats', () => {
      expect(chats).toEqual([shortChatStub()]);
    });
  });
});
