import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from './prisma/client';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {
    const pool = new Pool({
      connectionString: configService.get('DATABASE_URL'),
      ssl: {
        rejectUnauthorized: false,
        pfx: fs.readFileSync(
          path.resolve(
            process.cwd(),
            configService.get('CLIENT_IDENTITY_PATH'),
          ),
        ),
        passphrase: configService.get('CLIENT_IDENTITY_PASSWORD'),
      },
    });

    const adapter = new PrismaPg(pool);

    super({ adapter });
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
