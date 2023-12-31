import { PrismaService } from 'prisma/prisma.service';
import { Test } from '@nestjs/testing';
import { ChatsPrismaMock } from 'chat/test/mocks';
import { fullChatStub } from 'chat/test/stubs';
import { BlockChatSocketReturn } from 'chat/chats.interface';
import { requestUserStub } from 'user/test/stubs';
import { PrismaModule } from 'prisma/prisma.module';
import { UnblockChatCommandHandler } from './unblock-chat.command-handler';
import { UnblockChatCommand } from './unblock-chat.command';
import { ChatIdDto } from 'chat/legacy/dto';

describe('when unblock chat is called', () => {
  let prismaService: PrismaService;
  let unblockChatCommandHandler: UnblockChatCommandHandler;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UnblockChatCommandHandler],
      imports: [PrismaModule],
    })
      .overrideProvider(PrismaService)
      .useValue(ChatsPrismaMock())
      .compile();

    prismaService = moduleRef.get<PrismaService>(PrismaService);
    unblockChatCommandHandler = moduleRef.get<UnblockChatCommandHandler>(
      UnblockChatCommandHandler,
    );
  });

  describe('when it is called correctly', () => {
    beforeAll(() => {
      prismaService.chat.findFirst = jest
        .fn()
        .mockResolvedValue(fullChatStub());
      prismaService.chat.update = jest.fn().mockResolvedValue({
        id: fullChatStub().id,
        users: [...fullChatStub().users, { id: 'another-user-id' }],
        blocked: false,
        blockedById: null,
      });
    });

    let data: BlockChatSocketReturn;
    const dto: ChatIdDto = {
      chatId: fullChatStub().id,
    };

    beforeEach(async () => {
      jest.clearAllMocks();
      data = await unblockChatCommandHandler.execute(
        new UnblockChatCommand(requestUserStub(), dto),
      );
    });

    it('should call chat find first', () => {
      expect(prismaService.chat.findFirst).toBeCalledTimes(1);
      expect(prismaService.chat.findFirst).toBeCalledWith({
        where: {
          id: fullChatStub().id,
          blocked: true,
          blockedById: requestUserStub().id,
        },
      });
    });

    it('should call chat update', () => {
      expect(prismaService.chat.update).toBeCalledTimes(1);
      expect(prismaService.chat.update).toBeCalledWith({
        where: { id: fullChatStub().id },
        data: { blocked: false, blockedById: null },
        select: {
          id: true,
          users: {
            select: { id: true },
          },
          blocked: true,
          blockedById: true,
        },
      });
    });

    it('should return data', () => {
      expect(data).toEqual({
        chatId: fullChatStub().id,
        users: [requestUserStub().id, 'another-user-id'],
        blocked: false,
        blockedById: null,
      });
    });
  });

  describe('when there is no such chat', () => {
    beforeAll(() => {
      prismaService.chat.findFirst = jest.fn().mockResolvedValue(undefined);
      prismaService.chat.update = jest.fn().mockResolvedValue(fullChatStub());
    });

    let data: BlockChatSocketReturn;
    let error;
    const dto: ChatIdDto = {
      chatId: fullChatStub().id,
    };

    beforeEach(async () => {
      jest.clearAllMocks();
      try {
        data = await unblockChatCommandHandler.execute(
          new UnblockChatCommand(requestUserStub(), dto),
        );
      } catch (responseError) {
        error = responseError;
      }
    });

    it('should call chat find first', () => {
      expect(prismaService.chat.findFirst).toBeCalledTimes(1);
      expect(prismaService.chat.findFirst).toBeCalledWith({
        where: {
          id: fullChatStub().id,
          blocked: true,
          blockedById: requestUserStub().id,
        },
      });
    });

    it('should not call chat update', () => {
      expect(prismaService.chat.update).not.toBeCalled();
    });

    it('should return undefined', () => {
      expect(data).toEqual(undefined);
    });

    it('should throw an error', () => {
      expect(error.status).toEqual(404);
      expect(error.message).toEqual('Not Found');
    });
  });
});
