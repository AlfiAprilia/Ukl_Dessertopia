import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
  ) {}

  @Get('my')
  @ApiOperation({
    summary: 'Lihat semua laporan penjualan milik seller',
    description:
      'Menampilkan daftar laporan penjualan berdasarkan seller yang sedang login.',
  })
  getMyReports(
    @Request() req: any,
  ) {
    return this.reportsService.getSellerReports(
      BigInt(req.user.id),
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lihat detail laporan penjualan',
    description:
      'Menampilkan detail laporan penjualan berdasarkan ID laporan.',
  })
  getDetail(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.reportsService.getReportDetail(
      BigInt(id),
    );
  }

  @Post('generate')
  @ApiOperation({
    summary: 'Generate laporan penjualan harian',
    description:
      'Menghitung dan menyimpan laporan penjualan hari ini berdasarkan transaksi yang telah selesai.',
  })
  generate(
    @Request() req: any,
  ) {
    return this.reportsService.generateDailyReport(
      BigInt(req.user.id),
      new Date(),
    );
  }
}