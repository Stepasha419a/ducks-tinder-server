import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { EditMessageCommand } from './edit-message.command';
import { ChatRepository } from 'src/domain/chat/repository';
import { MessageAggregate } from 'src/domain/chat';
import { DateUtil } from 'src/infrastructure/util';

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
    const savedMessage = await this.repository.saveMessage(message);

    return savedMessage;
  }
}
