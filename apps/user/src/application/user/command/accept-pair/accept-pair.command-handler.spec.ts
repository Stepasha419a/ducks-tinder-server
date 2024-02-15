import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AcceptPairCommandHandler } from './accept-pair.command-handler';
import { AcceptPairCommand } from './accept-pair.command';
import { UserRepository } from 'apps/user/src/domain/user/repository';
import { SERVICES } from '@app/common/shared/constant';
import { ClientProxy } from '@nestjs/microservices';
import { ClientProxyMock, UserRepositoryMock } from 'apps/user/src/test/mock';
import { UserAggregateStub, UserStub } from 'apps/user/src/test/stub';

describe('when accept pair is called', () => {
  let repository: UserRepository;
  let chatClient: ClientProxy;
  let acceptPairCommandHandler: AcceptPairCommandHandler;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AcceptPairCommandHandler,
        { provide: SERVICES.CHAT, useValue: ClientProxyMock() },
        { provide: UserRepository, useValue: UserRepositoryMock() },
      ],
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: `.env.${process.env.NODE_ENV}`,
        }),
      ],
    }).compile();

    repository = moduleRef.get<UserRepository>(UserRepository);
    chatClient = moduleRef.get<ClientProxy>(SERVICES.CHAT);
    acceptPairCommandHandler = moduleRef.get<AcceptPairCommandHandler>(
      AcceptPairCommandHandler,
    );
  });

  describe('when it is called correctly', () => {
    const pairId = '34545656';

    beforeAll(() => {
      repository.findPair = jest
        .fn()
        .mockResolvedValue({ ...UserAggregateStub(), id: pairId });
    });

    let response: string;

    beforeEach(async () => {
      jest.clearAllMocks();
      try {
        response = await acceptPairCommandHandler.execute(
          new AcceptPairCommand(UserStub().id, pairId),
        );
      } catch {}
    });

    it('should call repository findPair', () => {
      expect(repository.findPair).toHaveBeenCalledTimes(1);
      expect(repository.findPair).toHaveBeenCalledWith(pairId, UserStub().id);
    });

    it('should call chatClient emit', () => {
      expect(chatClient.emit).toHaveBeenCalledTimes(1);
      expect(chatClient.emit).toHaveBeenCalledWith('create_chat', [
        UserStub().id,
        pairId,
      ]);
    });

    it('should call repository deletePair', () => {
      expect(repository.deletePair).toHaveBeenCalledTimes(1);
      expect(repository.deletePair).toHaveBeenCalledWith(pairId, UserStub().id);
    });

    it('should return accepted pairId', () => {
      expect(response).toEqual(pairId);
    });
  });

  describe('when such user pair does not exist', () => {
    beforeAll(() => {
      repository.findPair = jest.fn().mockResolvedValue(undefined);
    });

    let response: string;
    let error;
    const pairId = '34545656';

    beforeEach(async () => {
      jest.clearAllMocks();
      try {
        response = await acceptPairCommandHandler.execute(
          new AcceptPairCommand(UserStub().id, pairId),
        );
      } catch (responseError) {
        error = responseError;
      }
    });

    it('should call repository findPair', () => {
      expect(repository.findPair).toHaveBeenCalledTimes(1);
      expect(repository.findPair).toHaveBeenCalledWith(pairId, UserStub().id);
    });

    it('should not call chatClient emit', () => {
      expect(chatClient.emit).not.toHaveBeenCalled();
    });

    it('should not call repository deletePair', () => {
      expect(repository.deletePair).not.toHaveBeenCalled();
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
