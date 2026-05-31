import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // GET /reviews/dessert/:dessertId — public
  @Get('dessert/:dessertId')
  @ApiOperation({ summary: 'Get semua review milik satu dessert — public' })
  findByDessert(@Param('dessertId', ParseIntPipe) dessertId: number) {
    return this.reviewsService.findByDessert(BigInt(dessertId));
  }

  // GET /reviews/my — user
  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lihat review saya — user' })
  findMyReviews(@Request() req: any) {
    return this.reviewsService.findMyReviews(req.user.id);
  }

  // POST /reviews — user
  @Post('add')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buat review baru — user' })
  create(@Request() req: any, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(req.user.id, dto);
  }

  // PATCH /reviews/:id — pemilik review
  @Patch('change/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update review — pemilik review' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
    @Body() dto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(BigInt(id), req.user.id, dto);
  }

  // DELETE /reviews/:id — pemilik review atau admin
  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Hapus review — pemilik review atau admin' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.reviewsService.remove(BigInt(id), req.user.id, req.user.role);
  }
}