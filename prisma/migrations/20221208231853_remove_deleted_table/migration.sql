/*
  Warnings:

  - You are about to drop the `Deleted` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- DropTable
DROP TABLE "Deleted";
