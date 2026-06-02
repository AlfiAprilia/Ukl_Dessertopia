import { IsString, IsOptional, IsNumber, IsPositive, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDessertDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  category_id!: number;

  @ApiProperty({ example: 'Es Krim Coklat Mint' })
  @IsString()
  @MaxLength(100)
  name!: string;

  @ApiProperty({ example: 'Perpaduan coklat dan mint segar', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 25000, required: false })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  price?: number;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  image?: any;
}