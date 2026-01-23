/*
  Warnings:

  - You are about to drop the `chat-visit` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "chat-visit" DROP CONSTRAINT "chat-visit_chatId_fkey";

-- DropForeignKey
ALTER TABLE "chat-visit" DROP CONSTRAINT "chat-visit_userId_fkey";

-- DropTable
DROP TABLE "chat-visit";

-- CreateTable
CREATE TABLE "users-on-chats" (
    "chatId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users-on-chats_pkey" PRIMARY KEY ("userId","chatId")
);

-- AddForeignKey
ALTER TABLE "users-on-chats" ADD CONSTRAINT "users-on-chats_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users-on-chats" ADD CONSTRAINT "users-on-chats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
