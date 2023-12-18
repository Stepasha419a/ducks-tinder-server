import { Chat } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { ChatFacade } from './application-services';

@Injectable()
export class ChatsService {
  constructor(private readonly facade: ChatFacade) {}

  async createChat(memberIds: string[]): Promise<Chat> {
    return this.facade.commands.createChat(memberIds);
  }
}
