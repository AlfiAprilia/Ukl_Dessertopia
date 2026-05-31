import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  // Recalculate average_rating & review_count di tabel dessert
  private async recalculateRating(dessertId: bigint) {
    const result = await this.prisma.review.aggregate({
      where: { dessert_id: dessertId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await this.prisma.dessert.update({
      where: { id: dessertId },
      data: {
        average_rating: result._avg.rating ?? 0,
        review_count: result._count.rating,
      },
    });
  }

  // GET semua review milik satu dessert
  async findByDessert(dessertId: bigint) {
    return this.prisma.review.findMany({
      where: { dessert_id: dessertId },
      include: {
        user: { select: { id: true, name: true, avatar_url: true } },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  // GET semua review milik user sendiri
  async findMyReviews(userId: bigint) {
    return this.prisma.review.findMany({
      where: { user_id: userId },
      include: {
        dessert: { select: { id: true, name: true, image_url: true } },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  // POST buat review baru — user
  async create(userId: bigint, dto: CreateReviewDto) {
    const dessertId = BigInt(dto.dessert_id);

    // Cek dessert ada
    const dessert = await this.prisma.dessert.findFirst({
      where: { id: dessertId, is_active: true },
    });
    if (!dessert) throw new NotFoundException('Dessert not found');

    // Cek sudah pernah review
    const existing = await this.prisma.review.findUnique({
      where: { user_id_dessert_id: { user_id: userId, dessert_id: dessertId } },
    });
    if (existing) throw new ConflictException('Kamu sudah pernah mereview dessert ini');

    const review = await this.prisma.review.create({
      data: {
        user_id: userId,
        dessert_id: dessertId,
        rating: dto.rating,
        comment: dto.comment,
      },
    });

    await this.recalculateRating(dessertId);
    return review;
  }

  // PATCH update review — hanya pemilik review
  async update(id: bigint, userId: bigint, dto: UpdateReviewDto) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');
    if (review.user_id !== userId) throw new ForbiddenException('Bukan review milikmu');

    const updated = await this.prisma.review.update({
      where: { id },
      data: { ...dto },
    });

    await this.recalculateRating(review.dessert_id);
    return updated;
  }

  // DELETE review — pemilik review atau admin
  async remove(id: bigint, userId: bigint, role: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');
    if (role !== 'admin' && review.user_id !== userId) {
      throw new ForbiddenException('Bukan review milikmu');
    }

    await this.prisma.review.delete({ where: { id } });
    await this.recalculateRating(review.dessert_id);

    return { message: 'Review berhasil dihapus' };
  }
}