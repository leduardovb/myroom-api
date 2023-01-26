-- DropForeignKey
ALTER TABLE "rent_place_complaints" DROP CONSTRAINT "rent_place_complaints_rent_place_id_fkey";

-- DropForeignKey
ALTER TABLE "rent_place_photos" DROP CONSTRAINT "rent_place_photos_rent_place_id_fkey";

-- DropForeignKey
ALTER TABLE "rent_places" DROP CONSTRAINT "rent_places_address_id_fkey";

-- DropForeignKey
ALTER TABLE "specifications" DROP CONSTRAINT "specifications_rent_place_id_fkey";

-- AddForeignKey
ALTER TABLE "rent_places" ADD CONSTRAINT "rent_places_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rent_place_complaints" ADD CONSTRAINT "rent_place_complaints_rent_place_id_fkey" FOREIGN KEY ("rent_place_id") REFERENCES "rent_places"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rent_place_photos" ADD CONSTRAINT "rent_place_photos_rent_place_id_fkey" FOREIGN KEY ("rent_place_id") REFERENCES "rent_places"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "specifications" ADD CONSTRAINT "specifications_rent_place_id_fkey" FOREIGN KEY ("rent_place_id") REFERENCES "rent_places"("id") ON DELETE CASCADE ON UPDATE CASCADE;
