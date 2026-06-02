import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import { CreateDessertDto } from './dto/create-dessert.dto';
import { UpdateDessertDto } from './dto/update-dessert.dto';

@Injectable()
export class DessertsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  async findAll(search?: string, categoryId?: number) {
    return this.prisma.dessert.findMany({
      where: {
        is_active: true,
        ...(search && { name: { contains: search } }),
        ...(categoryId && { category_id: BigInt(categoryId) }),
      },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        seller: { select: { id: true, name: true } },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findMyDesserts(sellerId: bigint) {
    return this.prisma.dessert.findMany({
      where: { seller_id: sellerId },
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: bigint) {
    const dessert = await this.prisma.dessert.findFirst({
      where: { id, is_active: true },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        seller: { select: { id: true, name: true } },
      },
    });

    if (!dessert) throw new NotFoundException('Dessert not found');
    return dessert;
  }

  async create(sellerId: bigint, req: any, dto: CreateDessertDto, file?: Express.Multer.File) {
    let image_url = dto.image_url;
    if (file) {
      image_url = this.uploadService.getFileUrl(req, file.filename);
    }

    const slug = dto.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    return this.prisma.dessert.create({
      data: {
        category_id: BigInt(dto.category_id),
        seller_id: sellerId,
        name: dto.name,
        slug,
        description: dto.description,
        price: dto.price,
        image_url,
      },
    });
  }

  async update(id: bigint, sellerId: bigint, role: string, req: any, dto: UpdateDessertDto, file?: Express.Multer.File) {
    const dessert = await this.findOne(id);

    if (role !== 'admin' && dessert.seller_id !== sellerId) {
      throw new ForbiddenException('Bukan dessert milikmu');
    }

    let image_url = dto.image_url;
    if (file) {
      image_url = this.uploadService.getFileUrl(req, file.filename);
    }

    const data: any = { ...dto, image_url };
    if (dto.category_id) data.category_id = BigInt(dto.category_id!);
    if (dto.name) {
      data.slug = dto.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    }

    return this.prisma.dessert.update({ where: { id }, data });
  }

  async remove(id: bigint, sellerId: bigint, role: string) {
    const dessert = await this.findOne(id);

    if (role !== 'admin' && dessert.seller_id !== sellerId) {
      throw new ForbiddenException('Bukan dessert milikmu');
    }

    return this.prisma.dessert.update({
      where: { id },
      data: { is_active: false },
    });
  }
}