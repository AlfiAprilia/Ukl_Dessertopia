import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  // GET /reports — admin only
  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get semua report — admin only' })
  findAll() {
    return this.reportsService.findAll();
  }

  // GET /reports/my — user
  @Get('my')
  @ApiOperation({ summary: 'Lihat report saya — user' })
  findMyReports(@Request() req: any) {
    return this.reportsService.findMyReports(req.user.id);
  }

  // GET /reports/:id — admin only
  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get detail report — admin only' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reportsService.findOne(BigInt(id));
  }

  // POST /reports — user
  @Post('add')
  @ApiOperation({ summary: 'Buat report baru — user' })
  create(@Request() req: any, @Body() dto: CreateReportDto) {
    return this.reportsService.create(req.user.id, dto);
  }

  // PATCH /reports/:id — admin only
  @Patch('change/:id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update status report — admin only' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReportDto,
  ) {
    return this.reportsService.update(BigInt(id), dto);
  }
}