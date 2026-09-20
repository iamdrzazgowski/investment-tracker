-- AlterTable
ALTER TABLE "assets" ADD COLUMN     "coinGeckoId" TEXT,
ALTER COLUMN "externalSymbol" DROP NOT NULL;
