import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDessertDto } from './dto/create-dessert.dto';
import { UpdateDessertDto } from './dto/update-dessert.dto';

@Injectable()
export class DessertsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search?: string, categoryId?: number) {
    return this.prisma.dessert.findMany({
      where: {
        is_active: true,
        ...(search && {
          name: { contains: search },
        }),
        ...(categoryId && {
          category_id: BigInt(categoryId),
        }),
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: bigint) {
    const dessert = await this.prisma.dessert.findFirst({
      where: { id, is_active: true },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    if (!dessert) throw new NotFoundException('Dessert not found');
    return dessert;
  }

  async create(dto: CreateDessertDto) {
    const slug = dto.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    return this.prisma.dessert.create({
      data: {
        category_id: BigInt(dto.category_id!),
        name: dto.name,
        slug,
        description: dto.description,
        price: dto.price,
        image_url: dto.image_url,
      },
    });
  }

  async update(id: bigint, dto: UpdateDessertDto) {
    await this.findOne(id);

    const data: any = { ...dto };
    if (dto.category_id) data.category_id = BigInt(dto.category_id);
    if (dto.name) {
      data.slug = dto.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    }

    return this.prisma.dessert.update({
      where: { id },
      data,
    });
  }

  async remove(id: bigint) {
    await this.findOne(id);

    return this.prisma.dessert.update({
      where: { id },
      data: { is_active: false },
    });
  }
}