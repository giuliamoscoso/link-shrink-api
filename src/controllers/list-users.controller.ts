import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('/users')
@UseGuards(AuthGuard('jwt'))
export class ListUsersController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!users) return { message: 'No users found.' };

    return users;
  }
}
