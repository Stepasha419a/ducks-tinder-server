export class ChatSelector {
  static selectMessage() {
    return {
      id: true,
      text: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
      chatId: true,
      replied: {
        select: {
          id: true,
          text: true,
          userId: true,
        },
      },
    };
  }

  static selectUserMessage() {
    return {
      id: true,
      text: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
      chatId: true,
      replied: {
        select: {
          id: true,
          text: true,
          userId: true,
        },
      },
      user: {
        select: {
          name: true,
        },
      },
    };
  }
}
