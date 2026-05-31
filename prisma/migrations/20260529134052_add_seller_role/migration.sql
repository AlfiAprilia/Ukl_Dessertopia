/*
  Warnings:

  - You are about to drop the column `created_by` on the `desserts` table. All the data in the column will be lost.
  - You are about to drop the column `is_verified_purchase` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `comment_likes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `comments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `dessert_images` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `dessert_ingredients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `dessert_tags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ingredients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `report_reports` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `review_likes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_favorites` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[auth_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `auth_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `comment_likes` DROP FOREIGN KEY `comment_likes_comment_id_fkey`;

-- DropForeignKey
ALTER TABLE `comment_likes` DROP FOREIGN KEY `comment_likes_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `comments` DROP FOREIGN KEY `comments_review_id_fkey`;

-- DropForeignKey
ALTER TABLE `comments` DROP FOREIGN KEY `comments_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `dessert_images` DROP FOREIGN KEY `dessert_images_dessert_id_fkey`;

-- DropForeignKey
ALTER TABLE `dessert_ingredients` DROP FOREIGN KEY `dessert_ingredients_dessert_id_fkey`;

-- DropForeignKey
ALTER TABLE `dessert_ingredients` DROP FOREIGN KEY `dessert_ingredients_ingredient_id_fkey`;

-- DropForeignKey
ALTER TABLE `dessert_tags` DROP FOREIGN KEY `dessert_tags_dessert_id_fkey`;

-- DropForeignKey
ALTER TABLE `dessert_tags` DROP FOREIGN KEY `dessert_tags_tag_id_fkey`;

-- DropForeignKey
ALTER TABLE `desserts` DROP FOREIGN KEY `desserts_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `report_reports` DROP FOREIGN KEY `report_reports_reporter_id_fkey`;

-- DropForeignKey
ALTER TABLE `review_likes` DROP FOREIGN KEY `review_likes_review_id_fkey`;

-- DropForeignKey
ALTER TABLE `review_likes` DROP FOREIGN KEY `review_likes_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_favorites` DROP FOREIGN KEY `user_favorites_dessert_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_favorites` DROP FOREIGN KEY `user_favorites_user_id_fkey`;

-- DropIndex
DROP INDEX `users_email_key` ON `users`;

-- AlterTable
ALTER TABLE `categories` ADD COLUMN `is_active` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `description` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `desserts` DROP COLUMN `created_by`,
    ADD COLUMN `image_url` VARCHAR(191) NULL,
    ADD COLUMN `price` DECIMAL(15, 2) NULL,
    MODIFY `description` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `reviews` DROP COLUMN `is_verified_purchase`,
    MODIFY `comment` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `email`,
    DROP COLUMN `password`,
    DROP COLUMN `role`,
    ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `auth_id` BIGINT NOT NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL,
    MODIFY `bio` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `comment_likes`;

-- DropTable
DROP TABLE `comments`;

-- DropTable
DROP TABLE `dessert_images`;

-- DropTable
DROP TABLE `dessert_ingredients`;

-- DropTable
DROP TABLE `dessert_tags`;

-- DropTable
DROP TABLE `ingredients`;

-- DropTable
DROP TABLE `report_reports`;

-- DropTable
DROP TABLE `review_likes`;

-- DropTable
DROP TABLE `tags`;

-- DropTable
DROP TABLE `user_favorites`;

-- CreateTable
CREATE TABLE `auth` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('user', 'admin', 'seller') NOT NULL DEFAULT 'user',
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `auth_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `order_code` VARCHAR(191) NOT NULL,
    `status` ENUM('pending', 'paid', 'processing', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    `total_amount` DECIMAL(15, 2) NOT NULL,
    `payment_method` ENUM('bank_transfer', 'e_wallet', 'cod') NULL,
    `payment_status` ENUM('unpaid', 'paid', 'failed', 'refund') NOT NULL DEFAULT 'unpaid',
    `shipping_address` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `orders_order_code_key`(`order_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_items` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `order_id` BIGINT NOT NULL,
    `dessert_id` BIGINT NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `price` DECIMAL(15, 2) NOT NULL,
    `subtotal` DECIMAL(15, 2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `order_items_order_id_dessert_id_key`(`order_id`, `dessert_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reports` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `reporter_id` BIGINT NOT NULL,
    `target_type` ENUM('dessert', 'review', 'user') NOT NULL,
    `target_id` BIGINT NOT NULL,
    `reason` VARCHAR(191) NOT NULL,
    `status` ENUM('pending', 'reviewed', 'resolved', 'rejected') NOT NULL DEFAULT 'pending',
    `admin_notes` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `users_auth_id_key` ON `users`(`auth_id`);

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_auth_id_fkey` FOREIGN KEY (`auth_id`) REFERENCES `auth`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_dessert_id_fkey` FOREIGN KEY (`dessert_id`) REFERENCES `desserts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reports` ADD CONSTRAINT `reports_reporter_id_fkey` FOREIGN KEY (`reporter_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
