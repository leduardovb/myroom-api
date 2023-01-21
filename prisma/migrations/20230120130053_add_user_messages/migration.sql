-- CreateTable
CREATE TABLE "userMessages" (
    "id" SERIAL NOT NULL,
    "message" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "senderId" INTEGER NOT NULL,
    "recipientId" INTEGER NOT NULL,

    CONSTRAINT "userMessages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "userMessages" ADD CONSTRAINT "userMessages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userMessages" ADD CONSTRAINT "userMessages_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
