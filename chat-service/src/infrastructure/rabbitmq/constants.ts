export const RABBITMQ = {
  CHAT: {
    QUEUE: 'chat.queue',
    EXCHANGE: 'chat.exchange',
    EVENTS: {
      CREATE_CHAT: 'chat.create',
    },
  },
  USER: {
    QUEUE: 'user.queue',
    EXCHANGE: 'user.exchange',
    EVENTS: {
      GET_SHORT_USER: 'user.get-short-user',
    },
  },
};
