import { IsNumber, IsOptional, IsString, IsPositive, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReviewDto {
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  dessert_id!: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  rating!: number;

  @IsOptional()
  @IsString()
  comment?: string;
}