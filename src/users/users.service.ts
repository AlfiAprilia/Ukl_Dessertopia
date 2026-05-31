import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      where: { is_active: true },
      select: {
        id: true,
        name: true,
        avatar_url: true,
        bio: true,
        phone: true,
        address: true,
        created_at: true,
        auth: {
          select: {
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async findOne(id: bigint) {
    const user = await this.prisma.user.findFirst({
      where: { id, is_active: true },
      select: {
        id: true,
        name: true,
        avatar_url: true,
        bio: true,
        phone: true,
        address: true,
        created_at: true,
        auth: {
          select: {
            email: true,
            role: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: bigint, dto: UpdateUserDto) {
    await this.findOne(id); // pastikan user ada

    return this.prisma.user.update({
      where: { id },
      data: { ...dto, updated_at: new Date() },
    });
  }

  async remove(id: bigint) {
    await this.findOne(id); // pastikan user ada

    // soft delete
    return this.prisma.user.update({
      where: { id },
      data: { is_active: false, updated_at: new Date() },
    });
  }
}