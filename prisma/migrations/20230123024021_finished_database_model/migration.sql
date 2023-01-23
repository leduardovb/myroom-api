-- CreateTable
CREATE TABLE "user_favorites" (
    "user_id" INTEGER NOT NULL,
    "rent_place_id" INTEGER NOT NULL,

    CONSTRAINT "user_favorites_pkey" PRIMARY KEY ("user_id","rent_place_id")
);

-- CreateTable
CREATE TABLE "rent_place_complaints" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(30) NOT NULL,
    "description" VARCHAR(300) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "rent_place_id" INTEGER NOT NULL,

    CONSTRAINT "rent_place_complaints_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_favorites" ADD CONSTRAINT "user_favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_favorites" ADD CONSTRAINT "user_favorites_rent_place_id_fkey" FOREIGN KEY ("rent_place_id") REFERENCES "rent_places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rent_place_complaints" ADD CONSTRAINT "rent_place_complaints_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rent_place_complaints" ADD CONSTRAINT "rent_place_complaints_rent_place_id_fkey" FOREIGN KEY ("rent_place_id") REFERENCES "rent_places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
