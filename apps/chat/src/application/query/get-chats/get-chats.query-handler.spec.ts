import { Test } from '@nestjs/testing';
import { PrismaModule } from 'prisma/prisma.module';
import { PrismaService } from 'prisma/prisma.service';
import { requestUserStub } from 'apps/user/src/test/stubs';
import { ChatsPrismaMock } from 'chat/test/mocks';
import { GetChatsQuery } from './get-chats.query';
import { GetChatsQueryHandler } from './get-chats.query-handler';
import { ShortChat } from 'chat/chats.interface';
import { UsersSelector } from 'apps/user/src/infrastructure/repository/user.selector';
import { shortChatStub } from 'chat/test/stubs';
import { ChatsSelector } from 'chat/chats.selector';

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
