import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getSellerReports(sellerId: bigint) {
    return this.prisma.report.findMany({
      where: {
        seller_id: sellerId,
      },
      orderBy: {
        report_date: 'desc',
      },
    });
  }

  async getReportDetail(id: bigint) {
    const report = await this.prisma.report.findUnique({
      where: { id },
    });

    if (!report) {
      throw new NotFoundException(
        'Report not found',
      );
    }

    return report;
  }

  async generateDailyReport(
    sellerId: bigint,
    date: Date,
  ) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const orderItems =
      await this.prisma.orderItem.findMany({
        where: {
          dessert: {
            seller_id: sellerId,
          },
          order: {
            created_at: {
              gte: start,
              lte: end,
            },
            status: 'completed',
          },
        },
        include: {
          order: true,
        },
      });

    const totalOrders =
      new Set(
        orderItems.map((i) => i.order_id.toString()),
      ).size;

    const totalCustomers =
      new Set(
        orderItems.map((i) =>
          i.order.user_id.toString(),
        ),
      ).size;

    const totalItemsSold =
      orderItems.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );

    const totalRevenue =
      orderItems.reduce(
        (sum, item) =>
          sum + Number(item.subtotal),
        0,
      );

    return this.prisma.report.upsert({
      where: {
        seller_id_report_date: {
          seller_id: sellerId,
          report_date: start,
        },
      },
      update: {
        total_orders: totalOrders,
        total_customers: totalCustomers,
        total_items_sold: totalItemsSold,
        total_revenue: totalRevenue,
      },
      create: {
        seller_id: sellerId,
        report_date: start,
        total_orders: totalOrders,
        total_customers: totalCustomers,
        total_items_sold: totalItemsSold,
        total_revenue: totalRevenue,
      },
    });
  }
}