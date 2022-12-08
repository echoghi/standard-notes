-- AlterTable
ALTER TABLE "Deleted" ADD COLUMN     "spellCheck" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "spellCheck" BOOLEAN NOT NULL DEFAULT false;
