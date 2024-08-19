-- DropForeignKey
ALTER TABLE "links" DROP CONSTRAINT "links_creator_id_fkey";

-- AlterTable
ALTER TABLE "links" ALTER COLUMN "creator_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "links" ADD CONSTRAINT "links_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
