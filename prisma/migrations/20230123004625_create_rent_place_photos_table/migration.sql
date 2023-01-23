-- CreateTable
CREATE TABLE "rent_place_photos" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "rent_place_id" INTEGER NOT NULL,

    CONSTRAINT "rent_place_photos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "rent_place_photos" ADD CONSTRAINT "rent_place_photos_rent_place_id_fkey" FOREIGN KEY ("rent_place_id") REFERENCES "rent_places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
