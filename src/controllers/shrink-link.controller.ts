import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ShrinkLinkService } from 'src/shrinker/shrink-link.service';
import { z } from 'zod';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

const shrinkLinkSchema = z.object({
  url: z.string().url(),
});

type shrinkLinkSchemaType = z.infer<typeof shrinkLinkSchema>;

interface JwtPayload {
  sub: string;
}

@Controller('/link')
@UseGuards(AuthGuard('jwt'))
export class ShrinkLinkController {
  constructor(private linkShrinker: ShrinkLinkService) {}

  @Post()
  async handle(
    @Body() body: shrinkLinkSchemaType,
    @Req() request: Request & { user?: JwtPayload },
  ) {
    if (!request.user) {
      return this.linkShrinker.shortenUrl(body.url);
    }

    return this.linkShrinker.shortenUrl(body.url, request.user.sub);
  }
}
