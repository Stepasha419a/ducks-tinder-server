import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ChatRepository } from 'src/domain/repository';
import { ChatAggregate } from 'src/domain';
import { CreateChatCommand } from './create-chat.command';
import { BadRequestException, Logger } from '@nestjs/common';
import { UserChatConnectionEntity } from 'src/domain/entity';

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
      throw new BadRequestException('Chat already exists');
    }

    const chat = ChatAggregate.create({ blocked: false });

    await this.repository.save(chat);

    await Promise.all(
      memberIds.map(async (userId) => {
        const userChatConnection = UserChatConnectionEntity.create({
          chatId: chat.id,
          userId,
        });

        await this.repository.saveUserChatConnection(userChatConnection);
      }),
    );
  }
}
