-- AlterTable
ALTER TABLE "users" ADD COLUMN     "lastReturnableId" TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_lastReturnableId_fkey" FOREIGN KEY ("lastReturnableId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
