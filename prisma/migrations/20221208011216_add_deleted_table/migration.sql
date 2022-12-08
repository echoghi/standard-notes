-- CreateTable
CREATE TABLE "Deleted" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deleted_pkey" PRIMARY KEY ("id")
);
