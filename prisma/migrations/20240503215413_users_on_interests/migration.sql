/*
  Warnings:

  - You are about to drop the column `interestId` on the `users-on-interests` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,interest]` on the table `users-on-interests` will be added. If there are existing duplicate values, this will fail.
  - Made the column `interest` on table `users-on-interests` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "users-on-interests_userId_interestId_key";

-- AlterTable
ALTER TABLE "users-on-interests" DROP COLUMN "interestId",
ALTER COLUMN "interest" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users-on-interests_userId_interest_key" ON "users-on-interests"("userId", "interest");
