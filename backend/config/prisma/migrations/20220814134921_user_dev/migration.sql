-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "tokens" SET DEFAULT ARRAY[]::TEXT[];