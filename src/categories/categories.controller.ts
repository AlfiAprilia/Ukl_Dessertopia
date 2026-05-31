import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // GET /categories — public
  @Get()
  @ApiOperation({ summary: 'Get semua kategori — public' })
  findAll() {
    return this.categoriesService.findAll();
  }

  // GET /categories/:id — public
  @Get(':id')
  @ApiOperation({ summary: 'Get detail kategori' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(BigInt(id));
  }

  // POST /categories — admin & seller
  @Post('add')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'seller')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buat kategori baru — admin & seller' })
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  // PATCH /categories/:id — admin & seller
  @Patch('change/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'seller')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update kategori — admin & seller' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(BigInt(id), dto);
  }

  // DELETE /categories/:id — admin & seller
  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'seller')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Hapus kategori — admin & seller' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(BigInt(id));
  }
}