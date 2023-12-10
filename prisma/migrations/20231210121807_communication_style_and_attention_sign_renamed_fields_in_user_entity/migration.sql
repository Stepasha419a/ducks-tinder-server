/*
  Warnings:

  - You are about to drop the column `attentionSignsId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `communicationStylesId` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_attentionSignsId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_communicationStylesId_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "attentionSignsId",
DROP COLUMN "communicationStylesId",
ADD COLUMN     "attentionSignId" TEXT,
ADD COLUMN     "communicationStyleId" TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_communicationStyleId_fkey" FOREIGN KEY ("communicationStyleId") REFERENCES "communication-styles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_attentionSignId_fkey" FOREIGN KEY ("attentionSignId") REFERENCES "attention-signs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
