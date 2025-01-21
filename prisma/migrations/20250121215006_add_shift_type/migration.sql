/*
  Warnings:

  - You are about to drop the column `break` on the `Shift` table. All the data in the column will be lost.
  - Added the required column `jobTypeId` to the `Shift` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Shift" DROP COLUMN "break",
ADD COLUMN     "jobTypeId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "JobType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "JobType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JobType_name_key" ON "JobType"("name");

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_jobTypeId_fkey" FOREIGN KEY ("jobTypeId") REFERENCES "JobType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
