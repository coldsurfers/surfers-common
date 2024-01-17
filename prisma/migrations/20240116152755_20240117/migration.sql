/*
  Warnings:

  - You are about to drop the column `auth_token` on the `AuthToken` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `AuthToken` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[account_id]` on the table `AuthToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `access_token` to the `AuthToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `account_id` to the `AuthToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AuthToken" DROP CONSTRAINT "AuthToken_user_id_fkey";

-- DropIndex
DROP INDEX "AuthToken_user_id_key";

-- AlterTable
ALTER TABLE "AuthToken" DROP COLUMN "auth_token",
DROP COLUMN "user_id",
ADD COLUMN     "access_token" TEXT NOT NULL,
ADD COLUMN     "account_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "email" TEXT NOT NULL,
    "provider" TEXT,
    "password" VARCHAR(255),
    "passwordSalt" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Staff" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_staff" BOOLEAN NOT NULL DEFAULT false,
    "is_authorized" BOOLEAN NOT NULL DEFAULT false,
    "account_id" TEXT NOT NULL,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_username_key" ON "Account"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_account_id_key" ON "Staff"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "AuthToken_account_id_key" ON "AuthToken"("account_id");

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthToken" ADD CONSTRAINT "AuthToken_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
