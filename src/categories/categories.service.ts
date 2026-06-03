import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  async findAll() {
    return this.prisma.category.findMany({
      where: { is_active: true },
      include: {
        children: {
          where: { is_active: true },
          select: { id: true, name: true, slug: true, icon_url: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: bigint) {
    const category = await this.prisma.category.findFirst({
      where: { id, is_active: true },
      include: {
        parent: {
          select: { id: true, name: true, slug: true },
        },
        children: {
          where: { is_active: true },
          select: { id: true, name: true, slug: true, icon_url: true },
        },
        desserts: {
          where: { is_active: true },
          select: { id: true, name: true, slug: true, price: true, image_url: true },
        },
      },
    });

    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async create(req: any, dto: CreateCategoryDto, file?: Express.Multer.File) {
    let icon_url = dto.icon_url;
    if (file) {
      icon_url = this.uploadService.getFileUrl(req, file.filename);
    }

    const slug = dto.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    return this.prisma.category.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
        icon_url,
        ...(dto.parent_id && { parent_id: BigInt(dto.parent_id) }),
      },
    });
  }

async update(id: bigint, req: any, dto: UpdateCategoryDto, file?: Express.Multer.File) {
  // ← ubah ini, cari tanpa filter is_active
  const existing = await this.prisma.category.findUnique({
    where: { id },
  });
  if (!existing) throw new NotFoundException('Category not found');

  let icon_url = dto.icon_url;
  if (file) {
    icon_url = this.uploadService.getFileUrl(req, file.filename);
  }

  const data: any = { ...dto, icon_url };
  if (dto.parent_id) data.parent_id = BigInt(dto.parent_id);
  if (dto.name) {
    data.slug = dto.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }

  return this.prisma.category.update({ where: { id }, data });
}

  async remove(id: bigint) {
    await this.findOne(id);

    return this.prisma.category.update({
      where: { id },
      data: { is_active: false },
    });
  }
}