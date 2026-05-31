import { IsString, IsOptional, IsNumber, IsPositive, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDessertDto {
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  category_id!: number;

  @IsString()
  @MaxLength(100)
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  price?: number;

  @IsOptional()
  @IsString()
  image_url?: string;
}