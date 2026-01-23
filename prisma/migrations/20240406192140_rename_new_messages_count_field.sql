/*
  Warnings:

  - You are about to drop the column `newMessagesCoung` on the `users-on-chats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users-on-chats" DROP COLUMN "newMessagesCoung",
ADD COLUMN     "newMessagesCount" INTEGER NOT NULL DEFAULT 0;
