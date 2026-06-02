/*
  Warnings:

  - You are about to drop the column `admin_notes` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `reason` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `reporter_id` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `target_id` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `target_type` on the `reports` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[seller_id,report_date]` on the table `reports` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `report_date` to the `reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seller_id` to the `reports` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `reports` DROP FOREIGN KEY `reports_reporter_id_fkey`;

-- AlterTable
ALTER TABLE `reports` DROP COLUMN `admin_notes`,
    DROP COLUMN `reason`,
    DROP COLUMN `reporter_id`,
    DROP COLUMN `status`,
    DROP COLUMN `target_id`,
    DROP COLUMN `target_type`,
    ADD COLUMN `report_date` DATETIME(3) NOT NULL,
    ADD COLUMN `seller_id` BIGINT NOT NULL,
    ADD COLUMN `total_customers` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `total_items_sold` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `total_orders` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `total_revenue` DECIMAL(15, 2) NOT NULL DEFAULT 0.00;

-- CreateIndex
CREATE UNIQUE INDEX `reports_seller_id_report_date_key` ON `reports`(`seller_id`, `report_date`);

-- AddForeignKey
ALTER TABLE `reports` ADD CONSTRAINT `reports_seller_id_fkey` FOREIGN KEY (`seller_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
