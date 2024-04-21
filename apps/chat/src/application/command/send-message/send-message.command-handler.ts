import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendMessageCommand } from './send-message.command';
import { ChatRepository } from 'apps/chat/src/domain/repository';
import { MessageAggregate } from 'apps/chat/src/domain';
import { NewMessageView } from '../../view';

@CommandHandler(SendMessageCommand)
export class SendMessageCommandHandler
  implements ICommandHandler<SendMessageCommand>
{
  constructor(private readonly repository: ChatRepository) {}

  async execute(command: SendMessageCommand): Promise<NewMessageView> {
    const { userId, dto, notifyUserIds } = command;

    const chat = await this.repository.findOneHavingMember(dto.chatId, userId);
    if (!chat) {
      throw new NotFoundException();
    }
    if (chat.blocked) {
      throw new ForbiddenException();
    }

    const replied = dto.repliedId
      ? await this.repository.findMessage(dto.repliedId)
      : undefined;
    if (dto.repliedId && !replied) {
      throw new NotFoundException();
    }

    const message = MessageAggregate.create({
      chatId: chat.id,
      replied: replied && {
        id: replied.id,
        name: replied.name,
        text: replied.text,
        userId: replied.userId,
      },
      text: dto.text,
      userId,
    });

    await this.repository.increaseChatVisits(chat.id, userId, 1);

    const savedMessage = await this.repository.saveMessage(message);

    const userNewMessagesCount =
      await this.repository.findUsersNewMessagesCount(chat.id, notifyUserIds);

    return { message: savedMessage, userNewMessagesCount };
  }
}
