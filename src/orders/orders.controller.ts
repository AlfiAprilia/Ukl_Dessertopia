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
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // GET /orders — admin & seller
  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin', 'seller')
  @ApiOperation({ summary: 'Get semua pesanan — admin & seller' })
  findAll() {
    return this.ordersService.findAll();
  }

  // GET /orders/my — user
  @Get('my')
  @ApiOperation({ summary: 'Lihat riwayat pesanan saya — user' })
  findMyOrders(@Request() req: any) {
    return this.ordersService.findMyOrders(req.user.id);
  }

  // GET /orders/:id
  @Get(':id')
  @ApiOperation({ summary: 'Get detail pesanan' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(BigInt(id));
  }

  // POST /orders — user
  @Post('add')
  @ApiOperation({ summary: 'Buat pesanan baru — user' })
  create(@Request() req: any, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(req.user.id, dto);
  }

  // PATCH /orders/:id — admin & seller
  @Patch('change/:id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'seller')
  @ApiOperation({ summary: 'Update status pesanan — admin & seller' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderDto,
  ) {
    return this.ordersService.update(BigInt(id), dto);
  }
}