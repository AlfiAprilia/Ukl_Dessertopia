import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DessertsService } from './desserts.service';
import { CreateDessertDto } from './dto/create-dessert.dto';
import { UpdateDessertDto } from './dto/update-dessert.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Desserts')
@Controller('desserts')
export class DessertsController {
  constructor(private readonly dessertsService: DessertsService) {}

  // GET /desserts — public
  @Get()
  @ApiOperation({ summary: 'Get semua dessert — public, support search & filter' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'category_id', required: false, type: Number })
  findAll(
    @Query('search') search?: string,
    @Query('category_id') categoryId?: number,
  ) {
    return this.dessertsService.findAll(search, categoryId);
  }

  // GET /desserts/:id — public
  @Get(':id')
  @ApiOperation({ summary: 'Get detail dessert' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.dessertsService.findOne(BigInt(id));
  }

  // POST /desserts — admin & seller
  @Post('add')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'seller')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buat dessert baru — admin & seller' })
  create(@Body() dto: CreateDessertDto) {
    return this.dessertsService.create(dto);
  }

  // PATCH /desserts/:id — admin & seller
  @Patch('change/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'seller')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update dessert — admin & seller' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDessertDto,
  ) {
    return this.dessertsService.update(BigInt(id), dto);
  }

  // DELETE /desserts/:id — admin & seller
  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'seller')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Hapus dessert — admin & seller' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.dessertsService.remove(BigInt(id));
  }
}