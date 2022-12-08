-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "pinned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "starred" BOOLEAN NOT NULL DEFAULT false;
