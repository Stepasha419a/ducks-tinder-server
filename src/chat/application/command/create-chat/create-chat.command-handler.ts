import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateChatCommand } from './create-chat.command';
import { ChatRepository } from 'chat/application/repository';
import { ChatAggregate } from 'chat/domain/chat.aggregate';

@CommandHandler(CreateChatCommand)
export class CreateChatCommandHandler
  implements ICommandHandler<CreateChatCommand>
{
  constructor(private readonly repository: ChatRepository) {}

  async execute(command: CreateChatCommand): Promise<void> {
    const { memberIds } = command;

    const chatCandidate = await this.repository.findOneByUserIds(memberIds);
    if (chatCandidate) {
      throw new BadRequestException('Chat already exists');
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
