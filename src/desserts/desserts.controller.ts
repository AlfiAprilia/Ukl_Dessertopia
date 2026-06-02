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
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiConsumes } from '@nestjs/swagger';
import { DessertsService } from './desserts.service';
import { CreateDessertDto } from './dto/create-dessert.dto';
import { UpdateDessertDto } from './dto/update-dessert.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { multerConfig } from '../upload/upload.service';

@ApiTags('Desserts')
@Controller('desserts')
export class DessertsController {
  constructor(private readonly dessertsService: DessertsService) {}

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

  @Get('my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get dessert milik seller sendiri' })
  findMyDesserts(@Request() req: any) {
    return this.dessertsService.findMyDesserts(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get detail dessert' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.dessertsService.findOne(BigInt(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'seller')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buat dessert baru — admin & seller' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  create(
    @Request() req: any,
    @Body() dto: CreateDessertDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.dessertsService.create(req.user.id, req, dto, file);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'seller')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update dessert — admin & seller' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
    @Body() dto: UpdateDessertDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.dessertsService.update(BigInt(id), req.user.id, req.user.role, req, dto, file);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'seller')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Hapus dessert — admin & seller' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.dessertsService.remove(BigInt(id), req.user.id, req.user.role);
  }
}