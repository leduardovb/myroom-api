-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "email" VARCHAR(60) NOT NULL,
    "document" CHAR(11) NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "gender" CHAR(1) NOT NULL,
    "phone" CHAR(11),
    "password" VARCHAR(30) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
