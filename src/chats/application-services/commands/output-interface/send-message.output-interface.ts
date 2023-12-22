import { MessageAggregate } from 'chats/domain';

export interface SendMessageOutput {
  message: MessageAggregate;
  userIds: string[];
}
