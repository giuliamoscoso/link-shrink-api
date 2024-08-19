import {
  ConflictException,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('/links')
@UseGuards(AuthGuard('jwt'))
export class DeleteLinkController {
  constructor(private prisma: PrismaService) {}

  @Delete('/:id')
  async handle(@Param() id: { id: string }) {
    const linkId = id.id;
    const link = await this.prisma.link.findUnique({ where: { id: linkId } });

    if (!link) {
      throw new NotFoundException('Link not found.');
    }

    if (link.deletedAt) {
      throw new ConflictException('Link already deleted.');
    }

    const deletedLink = await this.prisma.link.update({
      where: { id: linkId },
      data: { updatedAt: new Date(), deletedAt: new Date() },
    });

    return {
      message: `The shrinked link '${deletedLink.shortUrl}' was deleted.`,
    };
  }
}
