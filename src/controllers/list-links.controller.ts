import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';

interface JwtPayload {
  sub: string;
}

@Controller('/links')
@UseGuards(AuthGuard('jwt'))
export class ListLinksController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@Req() request: Request & { user: JwtPayload }) {
    const userId = request.user.sub;

    const links = await this.prisma.link.findMany({
      where: {
        creatorId: userId,
        deletedAt: null,
      },
    });

    if (!links) return { message: 'No links found.' };

    return links;
  }
}
