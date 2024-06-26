import { shortUserStub } from './short-user.stub';

export const fullChatStub = () => ({
  id: 'asdasd123123',
  users: [shortUserStub()],
  messages: [
    {
      id: '123asd234',
      text: 'message text',
      userId: shortUserStub().id,
      createdAt: new Date('2022-01-01'),
      updatedAt: new Date('2022-01-01'),
      replied: null,
    },
  ],
  messagesCount: 20,
  blocked: false,
  blockedById: null,
});
