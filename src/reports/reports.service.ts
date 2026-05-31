import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  // GET semua report — admin only
  async findAll() {
    return this.prisma.report.findMany({
      include: {
        reporter: { select: { id: true, name: true } },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  // GET detail satu report — admin only
  async findOne(id: bigint) {
    const report = await this.prisma.report.findUnique({
      where: { id },
      include: {
        reporter: { select: { id: true, name: true } },
      },
    });

    if (!report) throw new NotFoundException('Report not found');
    return report;
  }

  // GET report milik user sendiri
  async findMyReports(userId: bigint) {
    return this.prisma.report.findMany({
      where: { reporter_id: userId },
      orderBy: { created_at: 'desc' },
    });
  }

  // POST buat report baru — user
  async create(userId: bigint, dto: CreateReportDto) {
    // Cek sudah pernah report target yang sama
    const existing = await this.prisma.report.findFirst({
      where: {
        reporter_id: userId,
        target_type: dto.target_type,
        target_id: BigInt(dto.target_id),
      },
    });
    if (existing) throw new ConflictException('Kamu sudah pernah melaporkan ini');

    return this.prisma.report.create({
      data: {
        reporter_id: userId,
        target_type: dto.target_type,
        target_id: BigInt(dto.target_id),
        reason: dto.reason,
      },
    });
  }

  // PATCH update status report — admin only
  async update(id: bigint, dto: UpdateReportDto) {
    await this.findOne(id);

    return this.prisma.report.update({
      where: { id },
      data: { ...dto },
    });
  }
}