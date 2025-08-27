/*
  Warnings:

  - You are about to drop the column `status` on the `order_products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."order_products" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "public"."orders" ADD COLUMN     "status" "public"."OrderEventStatus" NOT NULL DEFAULT 'PENDING';
