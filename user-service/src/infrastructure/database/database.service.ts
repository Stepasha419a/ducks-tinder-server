import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import * as path from 'path';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {
    const identityPath = path.resolve(
      configService.get('CLIENT_IDENTITY_PATH'),
    );
    const sslPassword = configService.get('CLIENT_IDENTITY_PASSWORD');

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
