import { PrismaService } from '@app/common/database/database.service';
import { BlockChatCommandHandler } from './block-chat.command-handler';
import { Test } from '@nestjs/testing';
import { ChatsPrismaMock } from 'apps/chat/src/test/mocks';
import { fullChatStub } from 'apps/chat/src/test/stubs';
import { BlockChatSocketReturn } from 'apps/chat/src/chats.interface';
import { BlockChatCommand } from './block-chat.command';
import { requestUserStub } from 'apps/user/src/test/stubs';
import { PrismaModule } from '@app/common/database/database.module';
import { fullChatWithoutDistanceStub } from 'apps/chat/src/test/stubs/full-chat-without-distance.stub';
import { ChatIdDto } from 'apps/chat/src/legacy/dto';

describe('when block chat is called', () => {
  let prismaService: PrismaService;
  let blockChatCommandHandler: BlockChatCommandHandler;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [BlockChatCommandHandler],
      imports: [PrismaModule],
    })
      .overrideProvider(PrismaService)
      .useValue(ChatsPrismaMock())
      .compile();

    prismaService = moduleRef.get<PrismaService>(PrismaService);
    blockChatCommandHandler = moduleRef.get<BlockChatCommandHandler>(
      BlockChatCommandHandler,
    );
  });

  describe('when it is called correctly', () => {
    beforeAll(() => {
      prismaService.chat.findFirst = jest
        .fn()
        .mockResolvedValue(fullChatStub());
      prismaService.chat.update = jest.fn().mockResolvedValue({
        id: fullChatWithoutDistanceStub().id,
        users: [
          ...fullChatWithoutDistanceStub().users,
          { id: 'another-user-id' },
        ],
        blocked: true,
        blockedById: requestUserStub().id,
      });
    });

    let data: BlockChatSocketReturn;
    const dto: ChatIdDto = {
      chatId: fullChatStub().id,
    };

    beforeEach(async () => {
      jest.clearAllMocks();
      data = await blockChatCommandHandler.execute(
        new BlockChatCommand(requestUserStub(), dto),
      );
    });

    it('should call chat find first', () => {
      expect(prismaService.chat.findFirst).toBeCalledTimes(1);
      expect(prismaService.chat.findFirst).toBeCalledWith({
        where: {
          id: fullChatStub().id,
          blocked: false,
          users: { some: { id: requestUserStub().id } },
        },
      });
    });

    it('should call chat update', () => {
      expect(prismaService.chat.update).toBeCalledTimes(1);
      expect(prismaService.chat.update).toBeCalledWith({
        where: { id: fullChatStub().id },
        data: { blocked: true, blockedById: requestUserStub().id },
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
        blocked: true,
        blockedById: requestUserStub().id,
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
        data = await blockChatCommandHandler.execute(
          new BlockChatCommand(requestUserStub(), dto),
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
          blocked: false,
          users: { some: { id: requestUserStub().id } },
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
