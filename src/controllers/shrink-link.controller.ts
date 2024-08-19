import {
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ShrinkLinkService } from 'src/shrinker/shrink-link.service';
import { z } from 'zod';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

const shrinkLinkSchema = z.object({
  url: z.string().url(),
});

type shrinkLinkSchemaType = z.infer<typeof shrinkLinkSchema>;

interface JwtPayload {
  sub: string;
}

@Controller('/links')
export class ShrinkLinkController {
  constructor(
    private linkShrinker: ShrinkLinkService,
    private jwtService: JwtService,
  ) {}

  @Post()
  async handle(
    @Body() body: shrinkLinkSchemaType,
    @Req() request: Request & { user?: JwtPayload },
  ) {
    let userId: string | null = null;

    const authHeader = request.headers.authorization;
    if (authHeader) {
      const [bearer, token] = authHeader.split(' ');
      if (bearer === 'Bearer' && token) {
        try {
          const decoded = this.jwtService.verify<JwtPayload>(token);
          userId = decoded.sub;
        } catch (error) {
          throw new UnauthorizedException('Invalid token.');
        }
      }
    }

    if (!userId) {
      return this.linkShrinker.shortenUrl(body.url);
    }

    return this.linkShrinker.shortenUrl(body.url, userId);
  }
}
