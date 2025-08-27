-- AlterTable
ALTER TABLE "public"."order_products" ADD COLUMN     "status" "public"."OrderEventStatus" NOT NULL DEFAULT 'PENDING';
