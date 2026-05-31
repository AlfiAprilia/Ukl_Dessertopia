import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // Cek email sudah terdaftar
    const existing = await this.prisma.auth.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Email already registered');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Buat auth + user sekaligus (transaction)
    const result = await this.prisma.$transaction(async (tx) => {
      const auth = await tx.auth.create({
        data: {
          email: dto.email,
          password: hashedPassword,
        },
      });

      const user = await tx.user.create({
        data: {
          auth_id: auth.id,
          name: dto.name,
        },
      });

      return { auth, user };
    });

    return {
      message: 'Registration successful',
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.auth.email,
      },
    };
  }

  async login(dto: LoginDto) {
    const auth = await this.prisma.auth.findUnique({
      where: { email: dto.email },
      include: { user: true },
    });

    if (!auth) throw new UnauthorizedException('Invalid credentials');
    if (!auth.is_active) throw new UnauthorizedException('Account is inactive');

    const isMatch = await bcrypt.compare(dto.password, auth.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = {
      sub: auth.id,
      email: auth.email,
      role: auth.role,
    };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: auth.user?.id,
        name: auth.user?.name,
        email: auth.email,
        role: auth.role,
      },
    };
  }

  async getProfile(authId: bigint) {
    const auth = await this.prisma.auth.findUnique({
      where: { id: authId },
      include: { user: true },
    });

    return {
      id: auth?.user?.id,
      name: auth?.user?.name,
      email: auth?.email,
      role: auth?.role,
      avatar_url: auth?.user?.avatar_url,
      bio: auth?.user?.bio,
      phone: auth?.user?.phone,
      address: auth?.user?.address,
    };
  }
}