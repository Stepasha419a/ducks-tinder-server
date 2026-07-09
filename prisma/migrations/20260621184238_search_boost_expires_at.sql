-- AlterTable
ALTER TABLE "_Pairs" ADD CONSTRAINT "_Pairs_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_Pairs_AB_unique";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "searchBoostExpiresAt" TIMESTAMP(3);
