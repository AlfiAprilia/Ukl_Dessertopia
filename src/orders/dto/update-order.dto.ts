import { IsOptional, IsEnum } from 'class-validator';
import { OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';

export class UpdateOrderDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsEnum(PaymentMethod)
  payment_method?: PaymentMethod;

  @IsOptional()
  @IsEnum(PaymentStatus)
  payment_status?: PaymentStatus;
}