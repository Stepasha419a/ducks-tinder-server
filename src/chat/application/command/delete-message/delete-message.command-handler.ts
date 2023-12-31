import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { DeleteMessageCommand } from './delete-message.command';
import { getDatesHourDiff } from 'common/helpers';
import { ChatRepository } from 'chat/application/repository';
import { MessageAggregate } from 'chat/domain';

@CommandHandler(DeleteMessageCommand)
export class DeleteMessageCommandHandler
  implements ICommandHandler<DeleteMessageCommand>
{
  constructor(private readonly repository: ChatRepository) {}

  async execute(command: DeleteMessageCommand): Promise<MessageAggregate> {
    const { userId, messageId } = command;

    const message = await this.repository.findMessage(messageId);
    if (!message) {
      throw new NotFoundException();
    }

    const chat = await this.repository.findOneHavingMember(
      message.chatId,
      userId,
    );
    if (!chat || chat?.blocked || message.userId !== userId) {
      throw new ForbiddenException();
    }

    const isMessageDeletable =
      getDatesHourDiff(new Date(), new Date(message.createdAt)) < 12;
    if (!isMessageDeletable) {
      throw new ForbiddenException();
    }

    await this.repository.deleteMessage(messageId);

    return message;
  }
}
