/*
  Warnings:

  - Changed the type of `role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('admin', 'user');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "name" TEXT,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "public"."Role" NOT NULL;
