import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomBytes } from 'crypto';

@Injectable()
export class ShrinkLinkService {
  constructor(private readonly prisma: PrismaService) {}

  async shortenUrl(originalUrl: string, creatorId?: string): Promise<string> {
    const isUrlAlreadyShrinked = await this.prisma.link.findUnique({
      where: { originalUrl },
    });

    if (isUrlAlreadyShrinked) {
      return isUrlAlreadyShrinked.shortUrl;
    }

    const shortUrl = this.generateShortUrl();

    const data: { originalUrl: string; shortUrl: string; creatorId?: string } =
      {
        originalUrl,
        shortUrl: `http://localhost/${shortUrl}`,
        ...(creatorId && { creatorId }),
      };

    const link = await this.prisma.link.create({ data });
    return link.shortUrl;
  }

  private generateShortUrl(): string {
    return randomBytes(3).toString('base64url');
  }
}
