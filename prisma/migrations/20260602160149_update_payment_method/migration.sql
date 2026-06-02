/*
  Warnings:

  - The values [bank_transfer,e_wallet,cod] on the enum `orders_payment_method` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `orders` MODIFY `payment_method` ENUM('tunai', 'kartu_kredit') NULL;
