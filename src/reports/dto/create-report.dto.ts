import { IsString, IsEnum, IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { ReportTargetType } from '@prisma/client';

export class CreateReportDto {
  @IsEnum(ReportTargetType)
  target_type!: ReportTargetType;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  target_id!: number;

  @IsString()
  reason!: string;
}