import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import * as path from 'path';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {
    const mode = configService.get('NODE_ENV');
    const certsPath = path.resolve(`./cert/${mode}`);

    const identityPath = `${certsPath}/client-identity.p12`;
    const sslPassword = configService.get('SSL_PASSWORD');

    const connection = `${configService.get('DATABASE_URL')}?sslmode=verify-full&sslidentity=${identityPath}&sslpassword=${sslPassword}`;

    super({
      datasources: {
        db: {
          url: connection,
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }
}
