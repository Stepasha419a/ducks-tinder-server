import { PrismaClient } from '../../prisma/client';

const databaseClient = new PrismaClient({ adapter: undefined });
export default databaseClient;
