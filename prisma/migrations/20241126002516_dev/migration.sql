/*
  Warnings:

  - A unique constraint covering the columns `[weekNumber,year]` on the table `Week` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `year` to the `Week` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Week_weekNumber_key";

-- AlterTable
ALTER TABLE "Week" ADD COLUMN     "year" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Week_weekNumber_year_key" ON "Week"("weekNumber", "year");
