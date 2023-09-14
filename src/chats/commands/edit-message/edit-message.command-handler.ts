import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { EditMessageCommand } from './edit-message.command';
import { ChatSocketMessageReturn } from 'chats/chats.interface';
import { ChatsSelector } from 'chats/chats.selector';
import { getDatesHourDiff } from 'common/helpers';
import { ChatsMapper } from 'chats/chats.mapper';

@CommandHandler(EditMessageCommand)
export class EditMessageCommandHandler
  implements ICommandHandler<EditMessageCommand>
{
  constructor(private readonly prismaService: PrismaService) {}

  async execute(command: EditMessageCommand): Promise<ChatSocketMessageReturn> {
    const { user, dto } = command;

    const chat = await this.prismaService.chat.findUnique({
      where: { id: dto.chatId },
      select: { id: true, blocked: true, users: { select: { id: true } } },
    });
    if (!chat || chat?.blocked) {
      throw new ForbiddenException();
    }

    const candidate = await this.prismaService.message.findFirst({
      where: { id: dto.messageId, userId: user.id },
    });
    if (!candidate) {
      throw new NotFoundException();
    }

    const isMessageEditable =
      getDatesHourDiff(new Date(), new Date(candidate.createdAt)) < 6;
    if (!isMessageEditable) {
      throw new ForbiddenException();
    }

    const message = await this.prismaService.message.update({
      where: { id: dto.messageId },
      data: { text: dto.text },
      select: ChatsSelector.selectMessage(),
    });

    return ChatsMapper.mapChatMessage(chat, message);
  }
}
