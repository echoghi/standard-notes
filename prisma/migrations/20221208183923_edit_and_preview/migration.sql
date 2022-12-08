-- AlterTable
ALTER TABLE "Deleted" ADD COLUMN     "editEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "preview" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "editEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "preview" BOOLEAN NOT NULL DEFAULT true;
