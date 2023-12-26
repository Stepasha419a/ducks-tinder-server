import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { EditMessageCommand } from './edit-message.command';
import { getDatesHourDiff } from 'common/helpers';
import { ChatRepository } from 'chats/providers';
import { MessageAggregate } from 'chats/domain';

@CommandHandler(EditMessageCommand)
export class EditMessageCommandHandler
  implements ICommandHandler<EditMessageCommand>
{
  constructor(private readonly repository: ChatRepository) {}

  async execute(command: EditMessageCommand): Promise<MessageAggregate> {
    const { userId, dto } = command;

    const message = await this.repository.findMessage(dto.messageId);
    if (!message) {
      throw new NotFoundException();
    }

    const chat = await this.repository.findOneHavingMember(
      message.chatId,
      userId,
    );
    if (!chat || chat.blocked || message.userId !== userId) {
      throw new ForbiddenException();
    }

    const isMessageEditable =
      getDatesHourDiff(new Date(), new Date(message.createdAt)) < 6;
    if (!isMessageEditable) {
      throw new ForbiddenException();
    }

    await message.setText(dto.text);
    await this.repository.saveMessage(message);

    return message;
  }
}
