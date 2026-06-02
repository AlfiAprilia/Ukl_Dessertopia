-- AlterTable
ALTER TABLE `desserts` ADD COLUMN `seller_id` BIGINT NULL;

-- AddForeignKey
ALTER TABLE `desserts` ADD CONSTRAINT `desserts_seller_id_fkey` FOREIGN KEY (`seller_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
