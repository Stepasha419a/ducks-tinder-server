import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { EditMessageCommand } from './edit-message.command';
import { ChatRepository } from 'apps/chat/src/domain/repository';
import { MessageAggregate } from 'apps/chat/src/domain';
import { DateUtil } from 'apps/chat/src/infrastructure/common/util/date.util';

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
      DateUtil.getDatesHourDiff(new Date(), new Date(message.createdAt)) < 6;
    if (!isMessageEditable) {
      throw new ForbiddenException();
    }

    await message.setText(dto.text);
    await this.repository.saveMessage(message);

    return message;
  }
}
