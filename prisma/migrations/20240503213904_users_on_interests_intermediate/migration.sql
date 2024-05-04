/*
  Warnings:

  - The primary key for the `users-on-interests` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `interests` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,interestId]` on the table `users-on-interests` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "users-on-interests" DROP CONSTRAINT "users-on-interests_interestId_fkey";

-- AlterTable
ALTER TABLE "users-on-interests" DROP CONSTRAINT "users-on-interests_pkey",
ADD COLUMN     "interest" TEXT;

-- DropTable
DROP TABLE "interests";

-- CreateIndex
CREATE UNIQUE INDEX "users-on-interests_userId_interestId_key" ON "users-on-interests"("userId", "interestId");
