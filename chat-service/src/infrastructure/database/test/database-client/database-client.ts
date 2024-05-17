import { PrismaClient } from '@prisma/client';

const databaseClient = new PrismaClient();
export default databaseClient;
