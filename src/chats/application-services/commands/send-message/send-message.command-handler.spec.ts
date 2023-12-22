import { Test } from '@nestjs/testing';
import { PrismaModule } from 'prisma/prisma.module';
import { PrismaService } from 'prisma/prisma.service';
import { ChatsPrismaMock } from 'chats/test/mocks';
import { fullChatStub, messageStub, shortChatStub } from 'chats/test/stubs';
import { SendMessageCommandHandler } from './send-message.command-handler';
import { SendMessageCommand } from './send-message.command';
import { requestUserStub } from 'users/test/stubs';
import { SendMessageDto } from 'chats/legacy/dto';
import { ChatSocketMessageReturn } from 'chats/chats.interface';
import { ChatsSelector } from 'chats/chats.selector';

describe('when send message is called', () => {
  let prismaService: PrismaService;
  let sendMessageCommandHandler: SendMessageCommandHandler;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [SendMessageCommandHandler],
      imports: [PrismaModule],
    })
      .overrideProvider(PrismaService)
      .useValue(ChatsPrismaMock())
      .compile();

    prismaService = moduleRef.get<PrismaService>(PrismaService);
    sendMessageCommandHandler = moduleRef.get<SendMessageCommandHandler>(
      SendMessageCommandHandler,
    );
  });

  describe('when it is called correctly', () => {
    beforeAll(() => {
      prismaService.chat.findUnique = jest.fn().mockResolvedValue({
        ...fullChatStub(),
        users: [...fullChatStub().users, { id: 'another-user-id' }],
      });
      prismaService.message.findUnique = jest
        .fn()
        .mockResolvedValue(messageStub());
      prismaService.message.create = jest.fn().mockResolvedValue({
        ...messageStub(),
        replied: {
          id: 'replied-message-id',
          text: 'replied-message-text',
          userId: 'replied-user-id',
        },
        repliedId: undefined,
      });
    });

    let data: ChatSocketMessageReturn;
    const sendMessageDto: SendMessageDto = {
      chatId: fullChatStub().id,
      text: 'message-text',
      repliedId: 'replied-message-id',
    };

    beforeEach(async () => {
      jest.clearAllMocks();
      data = await sendMessageCommandHandler.execute(
        new SendMessageCommand(requestUserStub(), sendMessageDto),
      );
    });

    it('should call chat find unique', () => {
      expect(prismaService.chat.findUnique).toBeCalledTimes(1);
      expect(prismaService.chat.findUnique).toBeCalledWith({
        where: { id: shortChatStub().id },
        select: {
          blocked: true,
          id: true,
          users: {
            select: {
              id: true,
            },
          },
        },
      });
    });

    it('should call message find unique', () => {
      expect(prismaService.message.findUnique).toBeCalledTimes(1);
      expect(prismaService.message.findUnique).toBeCalledWith({
        where: { id: sendMessageDto.repliedId },
      });
    });

    it('should call message create', () => {
      expect(prismaService.message.create).toBeCalledTimes(1);
      expect(prismaService.message.create).toBeCalledWith({
        data: {
          userId: requestUserStub().id,
          chatId: shortChatStub().id,
          text: sendMessageDto.text,
          repliedId: sendMessageDto.repliedId,
        },
        select: ChatsSelector.selectMessage(),
      });
    });

    it('should return a data', () => {
      expect(data).toStrictEqual({
        chatId: fullChatStub().id,
        message: {
          ...messageStub(),
          replied: {
            id: 'replied-message-id',
            text: 'replied-message-text',
            userId: 'replied-user-id',
          },
          repliedId: undefined,
        },
        users: [requestUserStub().id, 'another-user-id'],
      });
    });
  });

  describe('when there is no replied message', () => {
    beforeAll(() => {
      prismaService.chat.findUnique = jest.fn().mockResolvedValue({
        ...fullChatStub(),
        users: [...fullChatStub().users, { id: 'another-user-id' }],
      });
      prismaService.message.findUnique = jest.fn().mockResolvedValue(undefined);
      prismaService.message.create = jest.fn().mockResolvedValue({
        ...messageStub(),
        replied: {
          id: 'replied-message-id',
          text: 'replied-message-text',
          userId: 'replied-user-id',
        },
        repliedId: undefined,
      });
    });

    let data: ChatSocketMessageReturn;
    let error;
    const sendMessageDto: SendMessageDto = {
      chatId: fullChatStub().id,
      text: 'message-text',
      repliedId: 'replied-message-id',
    };

    beforeEach(async () => {
      jest.clearAllMocks();
      try {
        data = await sendMessageCommandHandler.execute(
          new SendMessageCommand(requestUserStub(), sendMessageDto),
        );
      } catch (responseError) {
        error = responseError;
      }
    });

    it('should call chat find unique', () => {
      expect(prismaService.chat.findUnique).toBeCalledTimes(1);
      expect(prismaService.chat.findUnique).toBeCalledWith({
        where: { id: shortChatStub().id },
        select: {
          blocked: true,
          id: true,
          users: {
            select: {
              id: true,
            },
          },
        },
      });
    });

    it('should call message find unique', () => {
      expect(prismaService.message.findUnique).toBeCalledTimes(1);
      expect(prismaService.message.findUnique).toBeCalledWith({
        where: { id: sendMessageDto.repliedId },
      });
    });

    it('should not call message create', () => {
      expect(prismaService.message.create).not.toBeCalled();
    });

    it('should return undefined', () => {
      expect(data).toStrictEqual(undefined);
    });

    it('should throw an error', () => {
      expect(error.status).toEqual(404);
      expect(error.message).toEqual('Not Found');
    });
  });

  describe('when there is no such chat', () => {
    beforeAll(() => {
      prismaService.chat.findUnique = jest.fn().mockResolvedValue(undefined);
      prismaService.message.findUnique = jest
        .fn()
        .mockResolvedValue(messageStub());
      prismaService.message.create = jest.fn().mockResolvedValue({
        ...messageStub(),
        replied: {
          id: 'replied-message-id',
          text: 'replied-message-text',
          userId: 'replied-user-id',
        },
        repliedId: undefined,
      });
    });

    let data: ChatSocketMessageReturn;
    let error;
    const sendMessageDto: SendMessageDto = {
      chatId: fullChatStub().id,
      text: 'message-text',
      repliedId: 'replied-message-id',
    };

    beforeEach(async () => {
      jest.clearAllMocks();
      try {
        data = await sendMessageCommandHandler.execute(
          new SendMessageCommand(requestUserStub(), sendMessageDto),
        );
      } catch (responseError) {
        error = responseError;
      }
    });

    it('should call chat find unique', () => {
      expect(prismaService.chat.findUnique).toBeCalledTimes(1);
      expect(prismaService.chat.findUnique).toBeCalledWith({
        where: { id: shortChatStub().id },
        select: {
          blocked: true,
          id: true,
          users: {
            select: {
              id: true,
            },
          },
        },
      });
    });

    it('should not call message find unique', () => {
      expect(prismaService.message.findUnique).not.toBeCalled();
    });

    it('should not call message create', () => {
      expect(prismaService.message.create).not.toBeCalled();
    });

    it('should return undefined', () => {
      expect(data).toStrictEqual(undefined);
    });

    it('should throw an error', () => {
      expect(error.status).toEqual(403);
      expect(error.message).toEqual('Forbidden');
    });
  });

  describe('when chat is blocked', () => {
    beforeAll(() => {
      prismaService.chat.findUnique = jest
        .fn()
        .mockResolvedValue({ blocked: true });
      prismaService.message.findUnique = jest
        .fn()
        .mockResolvedValue(messageStub());
      prismaService.message.create = jest.fn().mockResolvedValue({
        ...messageStub(),
        replied: {
          id: 'replied-message-id',
          text: 'replied-message-text',
          userId: 'replied-user-id',
        },
        repliedId: undefined,
      });
    });

    let data: ChatSocketMessageReturn;
    let error;
    const sendMessageDto: SendMessageDto = {
      chatId: fullChatStub().id,
      text: 'message-text',
      repliedId: 'replied-message-id',
    };

    beforeEach(async () => {
      jest.clearAllMocks();
      try {
        data = await sendMessageCommandHandler.execute(
          new SendMessageCommand(requestUserStub(), sendMessageDto),
        );
      } catch (responseError) {
        error = responseError;
      }
    });

    it('should call chat find unique', () => {
      expect(prismaService.chat.findUnique).toBeCalledTimes(1);
      expect(prismaService.chat.findUnique).toBeCalledWith({
        where: { id: shortChatStub().id },
        select: {
          blocked: true,
          id: true,
          users: {
            select: {
              id: true,
            },
          },
        },
      });
    });

    it('should not call message find unique', () => {
      expect(prismaService.message.findUnique).not.toBeCalled();
    });

    it('should not call message create', () => {
      expect(prismaService.message.create).not.toBeCalled();
    });

    it('should return undefined', () => {
      expect(data).toStrictEqual(undefined);
    });

    it('should throw an error', () => {
      expect(error.status).toEqual(403);
      expect(error.message).toEqual('Forbidden');
    });
  });
});
