import { IsString, IsOptional, IsNumber, IsPositive, MaxLength } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Es Krim' })
  @IsString()
  @MaxLength(100)
  name!: string;

  @ApiProperty({ example: 'Berbagai jenis es krim', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  @Transform(({ value }) => value === '' || value === null ? undefined : Number(value))
  parent_id?: number;

  @ApiProperty({ example: 'https://example.com/icon.png', required: false })
  @IsOptional()
  @IsString()
  icon_url?: string;
}