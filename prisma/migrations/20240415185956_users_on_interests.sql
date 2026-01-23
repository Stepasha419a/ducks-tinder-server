-- CreateTable
CREATE TABLE "users-on-interests" (
    "interestId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "newMessagesCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "users-on-interests_pkey" PRIMARY KEY ("userId","interestId")
);

-- AddForeignKey
ALTER TABLE "users-on-interests" ADD CONSTRAINT "users-on-interests_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "interests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users-on-interests" ADD CONSTRAINT "users-on-interests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
