/*
  Warnings:

  - Added the required column `createdAt` to the `Deleted` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Deleted` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Deleted" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "pinned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "starred" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
