/*
  Warnings:

  - You are about to drop the `_InterestToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_InterestToUser" DROP CONSTRAINT "_InterestToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_InterestToUser" DROP CONSTRAINT "_InterestToUser_B_fkey";

-- DropTable
DROP TABLE "_InterestToUser";
