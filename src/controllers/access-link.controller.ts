import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';
import { Response } from 'express';

const paramsSchema = z.object({
  shortUrl: z.string().max(6),
});

type ParamsSchemaType = z.infer<typeof paramsSchema>;

@Controller('/')
export class AccessLinkController {
  constructor(private prisma: PrismaService) {}

  @Get('/:shortUrl')
  async handle(@Param() params: ParamsSchemaType, @Res() res: Response) {
    const parsedParams = paramsSchema.parse(params);
    const { shortUrl } = parsedParams;

    const link = await this.prisma.link.findUnique({
      where: { shortUrl: `http://localhost/${shortUrl}` },
    });

    if (!link) {
      throw new NotFoundException('Link not found.');
    }

    await this.prisma.link.update({
      where: { shortUrl: `http://localhost/${shortUrl}` },
      data: { accessCount: link.accessCount + 1 },
    });

    return res.redirect(link.originalUrl);
  }
}
