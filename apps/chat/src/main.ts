import { NestFactory } from '@nestjs/core';
import { ChatModule } from './chat.module';

async function bootstrap() {
  const app = await NestFactory.create(ChatModule);
  await app.listen(3000);
}
bootstrap();
