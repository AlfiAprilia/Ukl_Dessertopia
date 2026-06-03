import { IsString, IsOptional, IsNumber, IsPositive, IsBoolean, MaxLength } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiProperty({ example: 'Es Krim', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiProperty({ example: 'Deskripsi kategori', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  @Transform(({ value }) => value === '' ? undefined : Number(value)) // ← tambah ini
  parent_id?: number;

  @ApiProperty({ example: 'https://example.com/icon.png', required: false })
  @IsOptional()
  @IsString()
  icon_url?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true) // ← tambah ini
  is_active?: boolean;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  image?: any;
}