import { shortUserStub } from 'user-service/src/legacy/user/test/stubs';

export const shortChatStub = () => ({
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
  blocked: false,
  blockedById: null,
});
