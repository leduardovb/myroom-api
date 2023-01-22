/*
  Warnings:

  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userMessages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "userMessages" DROP CONSTRAINT "userMessages_recipientId_fkey";

-- DropForeignKey
ALTER TABLE "userMessages" DROP CONSTRAINT "userMessages_senderId_fkey";

-- DropTable
DROP TABLE "user";

-- DropTable
DROP TABLE "userMessages";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "email" VARCHAR(60) NOT NULL,
    "document" CHAR(11) NOT NULL,
    "gender" CHAR(1) NOT NULL,
    "phone" CHAR(11),
    "password" VARCHAR(100) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_messages" (
    "id" SERIAL NOT NULL,
    "message" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sender_id" INTEGER NOT NULL,
    "recipient_id" INTEGER NOT NULL,

    CONSTRAINT "user_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rent_places" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "description" VARCHAR(300),
    "type" VARCHAR(11) NOT NULL,
    "roomType" VARCHAR(13) NOT NULL,
    "value" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,
    "address_id" INTEGER NOT NULL,

    CONSTRAINT "rent_places_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "specifications" (
    "description" VARCHAR(300) NOT NULL,
    "amount" INTEGER NOT NULL,
    "rent_place_id" INTEGER NOT NULL,

    CONSTRAINT "specifications_pkey" PRIMARY KEY ("description","rent_place_id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" SERIAL NOT NULL,
    "street_name" VARCHAR(60) NOT NULL,
    "building_code" VARCHAR(10) NOT NULL,
    "complement" VARCHAR(45),
    "neighborhood" VARCHAR(60) NOT NULL,
    "city" VARCHAR(60) NOT NULL,
    "state" VARCHAR(2) NOT NULL,
    "zip_code" CHAR(8) NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rent_places_address_id_key" ON "rent_places"("address_id");

-- AddForeignKey
ALTER TABLE "user_messages" ADD CONSTRAINT "user_messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_messages" ADD CONSTRAINT "user_messages_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rent_places" ADD CONSTRAINT "rent_places_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rent_places" ADD CONSTRAINT "rent_places_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "specifications" ADD CONSTRAINT "specifications_rent_place_id_fkey" FOREIGN KEY ("rent_place_id") REFERENCES "rent_places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
