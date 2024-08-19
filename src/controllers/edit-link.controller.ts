import {
  Body,
  ConflictException,
  Controller,
  NotFoundException,
  Param,
  Patch,
  UsePipes,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';

const paramsSchema = z.object({
  id: z.string(),
});

const editLinkSchema = z.object({
  url: z.string().url(),
});

type ParamsSchemaType = z.infer<typeof paramsSchema>;
type EditLinkSchemaType = z.infer<typeof editLinkSchema>;

@Controller('/links')
export class EditLinkController {
  constructor(private prisma: PrismaService) {}

  @Patch('/:id')
  async handle(
    @Param() params: ParamsSchemaType,
    @Body() body: EditLinkSchemaType,
  ) {
    const parsedParams = paramsSchema.parse(params);
    const parsedBody = editLinkSchema.parse(body);

    const { id } = parsedParams;
    const { url } = parsedBody;

    const link = await this.prisma.link.findUnique({ where: { id } });

    if (!link) {
      throw new NotFoundException('Link not found.');
    }

    await this.prisma.link.update({
      where: { id },
      data: { originalUrl: url },
    });
  }
}
