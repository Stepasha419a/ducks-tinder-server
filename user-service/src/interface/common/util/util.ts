import { RmqContext } from '@nestjs/microservices';

export class Util {
  static ackMessage(context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
  }
}
