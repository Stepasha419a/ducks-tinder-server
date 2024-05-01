/*
  Warnings:

  - You are about to drop the column `alcoholAttitudeId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `attentionSignId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `childrenAttitudeId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `chronotypeId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `communicationStyleId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `educationId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `foodPreferenceId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `personalityTypeId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `petId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `smokingAttitudeId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `socialNetworksActivityId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `trainingAttitudeId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `zodiacSignId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `alcohol-attitudes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `attention-signs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `children-attitudes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `chronotypes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `communication-styles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `educations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `food-preferences` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `personality-types` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `smoking-attitudes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `social-networks-activities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `training-attitudes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `zodiac-signs` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "alcoholAttitudeId",
DROP COLUMN "attentionSignId",
DROP COLUMN "childrenAttitudeId",
DROP COLUMN "chronotypeId",
DROP COLUMN "communicationStyleId",
DROP COLUMN "educationId",
DROP COLUMN "foodPreferenceId",
DROP COLUMN "personalityTypeId",
DROP COLUMN "petId",
DROP COLUMN "smokingAttitudeId",
DROP COLUMN "socialNetworksActivityId",
DROP COLUMN "trainingAttitudeId",
DROP COLUMN "zodiacSignId";

-- DropTable
DROP TABLE "alcohol-attitudes";

-- DropTable
DROP TABLE "attention-signs";

-- DropTable
DROP TABLE "children-attitudes";

-- DropTable
DROP TABLE "chronotypes";

-- DropTable
DROP TABLE "communication-styles";

-- DropTable
DROP TABLE "educations";

-- DropTable
DROP TABLE "food-preferences";

-- DropTable
DROP TABLE "personality-types";

-- DropTable
DROP TABLE "pets";

-- DropTable
DROP TABLE "smoking-attitudes";

-- DropTable
DROP TABLE "social-networks-activities";

-- DropTable
DROP TABLE "training-attitudes";

-- DropTable
DROP TABLE "zodiac-signs";
