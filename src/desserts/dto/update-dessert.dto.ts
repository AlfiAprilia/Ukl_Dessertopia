import { IsString, IsOptional, IsNumber, IsPositive, IsBoolean, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateDessertDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  category_id?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

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

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}