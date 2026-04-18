-- AlterTable
ALTER TABLE "message" ADD COLUMN     "metaData" JSONB DEFAULT '{}',
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'text',
ALTER COLUMN "content" DROP NOT NULL,
ALTER COLUMN "timestamp" SET DEFAULT now();

-- AlterTable
ALTER TABLE "request" ALTER COLUMN "timestamp" SET DEFAULT now();

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "id" SET DEFAULT gen_random_uuid ( );
