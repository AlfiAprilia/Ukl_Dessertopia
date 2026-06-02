import { IsString, IsOptional, IsNumber, IsPositive, IsBoolean, MaxLength } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDessertDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  category_id?: number;

  @ApiProperty({ example: 'Es Krim Coklat Mint Special', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiProperty({ example: 'Deskripsi baru', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 30000, required: false })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  price?: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  is_active?: boolean;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  image?: any;
}