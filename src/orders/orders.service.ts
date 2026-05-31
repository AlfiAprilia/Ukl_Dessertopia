import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  // Generate order code unik
  private generateOrderCode(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  }

  // GET semua pesanan — admin & seller
  async findAll() {
    return this.prisma.order.findMany({
      include: {
        user: { select: { id: true, name: true } },
        order_items: {
          include: {
            dessert: { select: { id: true, name: true, image_url: true } },
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  // GET riwayat pesanan milik user sendiri
  async findMyOrders(userId: bigint) {
    return this.prisma.order.findMany({
      where: { user_id: userId },
      include: {
        order_items: {
          include: {
            dessert: { select: { id: true, name: true, image_url: true } },
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  // GET detail satu pesanan
  async findOne(id: bigint) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true } },
        order_items: {
          include: {
            dessert: { select: { id: true, name: true, price: true, image_url: true } },
          },
        },
      },
    });

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  // POST buat pesanan baru — user
  async create(userId: bigint, dto: CreateOrderDto) {
    // Ambil semua dessert yang dipesan
    const dessertIds = dto.items.map((i) => BigInt(i.dessert_id));
    const desserts = await this.prisma.dessert.findMany({
      where: { id: { in: dessertIds }, is_active: true },
    });

    if (desserts.length !== dto.items.length) {
      throw new BadRequestException('Salah satu dessert tidak ditemukan atau tidak aktif');
    }

    // Hitung total & subtotal
    let total_amount = 0;
    const orderItems = dto.items.map((item) => {
      const dessert = desserts.find((d) => d.id === BigInt(item.dessert_id))!;
      const price = Number(dessert.price);
      const subtotal = price * item.quantity;
      total_amount += subtotal;

      return {
        dessert_id: BigInt(item.dessert_id),
        quantity: item.quantity,
        price,
        subtotal,
      };
    });

    return this.prisma.order.create({
      data: {
        user_id: userId,
        order_code: this.generateOrderCode(),
        total_amount,
        payment_method: dto.payment_method,
        shipping_address: dto.shipping_address,
        notes: dto.notes,
        order_items: {
          create: orderItems,
        },
      },
      include: {
        order_items: {
          include: {
            dessert: { select: { id: true, name: true } },
          },
        },
      },
    });
  }

  // PATCH update status pesanan — admin & seller
  async update(id: bigint, dto: UpdateOrderDto) {
    await this.findOne(id);

    return this.prisma.order.update({
      where: { id },
      data: { ...dto },
    });
  }
}