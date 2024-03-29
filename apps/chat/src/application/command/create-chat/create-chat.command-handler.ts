import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ChatRepository } from 'apps/chat/src/domain/repository';
import { ChatAggregate } from 'apps/chat/src/domain';
import { CreateChatCommand } from './create-chat.command';
import { Logger } from '@nestjs/common';

@CommandHandler(CreateChatCommand)
export class CreateChatCommandHandler
  implements ICommandHandler<CreateChatCommand>
{
  logger: Logger = new Logger();
  constructor(private repository: ChatRepository) {}

  async execute(command: CreateChatCommand) {
    const { memberIds } = command;

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
