import { IsString, IsOptional, IsNumber, IsPositive, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCategoryDto {
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
  parent_id?: number;

  @IsOptional()
  @IsString()
  icon_url?: string;
}