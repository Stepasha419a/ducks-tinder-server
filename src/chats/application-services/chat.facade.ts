import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateChatCommand } from './commands';

@Injectable()
export class ChatFacade {
  constructor(private readonly commandBus: CommandBus) {}

  commands = {
    createChat: (memberIds) => this.createChat(memberIds),
  };

  private createChat(memberIds: string[]) {
    return this.commandBus.execute<CreateChatCommand>(
      new CreateChatCommand(memberIds),
    );
  }
}
