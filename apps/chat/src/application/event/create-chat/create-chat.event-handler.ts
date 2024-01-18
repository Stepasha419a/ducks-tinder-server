import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ChatRepository } from 'apps/chat/src/domain/repository';
import { ChatAggregate } from 'apps/chat/src/domain';
import { AcceptPairEvent } from 'apps/user/src/domain/event';

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
