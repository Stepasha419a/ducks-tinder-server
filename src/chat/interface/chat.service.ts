import { Chat } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { ChatFacade } from 'chat/application';

@Injectable()
export class ChatService {
  constructor(private readonly facade: ChatFacade) {}

  async createChat(memberIds: string[]): Promise<Chat> {
    return this.facade.commands.createChat(memberIds);
  }
}
