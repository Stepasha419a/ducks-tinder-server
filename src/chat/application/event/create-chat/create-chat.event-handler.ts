import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ChatRepository } from 'chat/domain/repository';
import { ChatAggregate } from 'chat/domain';
import { AcceptPairEvent } from 'user/domain/event';

@EventsHandler(AcceptPairEvent)
export class CreateChatEventHandler implements IEventHandler<AcceptPairEvent> {
  constructor(private repository: ChatRepository) {}
  logger: Logger = new Logger();

  async handle(event: AcceptPairEvent) {
    const { id, pairId } = event;

    const memberIds = [id, pairId];

    const chatCandidate = await this.repository.findOneByUserIds(memberIds);
    if (chatCandidate) {
      //throw new BadRequestException('Chat already exists');
      this.logger.error('Chat already exists');
      return;
    }

    const chat = ChatAggregate.create({ blocked: false });

    await this.repository.save(chat);

    await Promise.all(
      memberIds.map(async (userId) => {
        await this.repository.connectUserToChat(chat.id, userId);
      }),
    );
  }
}
