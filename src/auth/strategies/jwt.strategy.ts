import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { sub: bigint; email: string; role: string }) {
    const auth = await this.prisma.auth.findUnique({
      where: { id: payload.sub },
      include: { user: true },
    });

    if (!auth || !auth.is_active) {
      throw new UnauthorizedException('Account is inactive or not found');
    }

    return {
      id: auth.user?.id,
      auth_id: auth.id,
      email: auth.email,
      role: auth.role,
      name: auth.user?.name,
    };
  }
}