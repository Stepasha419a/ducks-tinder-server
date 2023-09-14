import { Test } from '@nestjs/testing';
import { PrismaModule } from 'prisma/prisma.module';
import { PrismaService } from 'prisma/prisma.service';
import { ChatsPrismaMock } from 'chats/test/mocks';
import { shortChatStub } from 'chats/test/stubs';
import { requestUserStub } from 'users/test/stubs';
import { ValidateChatMemberQueryHandler } from './validate-chat-member.query-handler';
import { ValidateChatMemberQuery } from './validate-chat-member.query';
import { ChatIdDto } from 'chats/dto';

describe('when get messages is called', () => {
  let prismaService: PrismaService;
  let validateChatMemberQueryHandler: ValidateChatMemberQueryHandler;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ValidateChatMemberQueryHandler],
      imports: [PrismaModule],
    })
      .overrideProvider(PrismaService)
      .useValue(ChatsPrismaMock())
      .compile();

    prismaService = moduleRef.get<PrismaService>(PrismaService);
    validateChatMemberQueryHandler =
      moduleRef.get<ValidateChatMemberQueryHandler>(
        ValidateChatMemberQueryHandler,
      );
  });

  describe('when it is called correctly', () => {
    beforeAll(() => {
      prismaService.chat.findFirst = jest
        .fn()
        .mockResolvedValue(shortChatStub());
    });

    let response;
    const dto: ChatIdDto = {
      chatId: shortChatStub().id,
    };

    beforeEach(async () => {
      jest.clearAllMocks();
      response = await validateChatMemberQueryHandler.execute(
        new ValidateChatMemberQuery(requestUserStub(), dto),
      );
    });

    it('should call chat find first', () => {
      expect(prismaService.chat.findFirst).toBeCalledTimes(1);
      expect(prismaService.chat.findFirst).toBeCalledWith({
        where: {
          id: shortChatStub().id,
          users: { some: { id: requestUserStub().id } },
        },
        select: {
          id: true,
        },
      });
    });

    it('should return undefined', () => {
      expect(response).toEqual(undefined);
    });
  });

  describe('when there is no such chat', () => {
    beforeAll(() => {
      prismaService.chat.findFirst = jest.fn().mockResolvedValue(undefined);
    });

    let response;
    let error;
    const dto: ChatIdDto = {
      chatId: shortChatStub().id,
    };

    beforeEach(async () => {
      jest.clearAllMocks();
      try {
        response = await validateChatMemberQueryHandler.execute(
          new ValidateChatMemberQuery(requestUserStub(), dto),
        );
      } catch (responseError) {
        error = responseError;
      }
    });

    it('should call chat find first', () => {
      expect(prismaService.chat.findFirst).toBeCalledTimes(1);
      expect(prismaService.chat.findFirst).toBeCalledWith({
        where: {
          id: shortChatStub().id,
          users: { some: { id: requestUserStub().id } },
        },
        select: {
          id: true,
        },
      });
    });

    it('should return undefined', () => {
      expect(response).toEqual(undefined);
    });

    it('should throw an error', () => {
      expect(error.status).toEqual(404);
      expect(error.message).toEqual('Not Found');
    });
  });
});
