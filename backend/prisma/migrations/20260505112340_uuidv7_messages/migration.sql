/*
  Warnings:

  - You are about to drop the column `metaData` on the `message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "message" DROP COLUMN "metaData",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "timestamp" SET DEFAULT now();

-- AlterTable
ALTER TABLE "request" ALTER COLUMN "timestamp" SET DEFAULT now();

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "id" SET DEFAULT gen_random_uuid (),
ALTER COLUMN "avatar" DROP DEFAULT;
