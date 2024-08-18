import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { z } from 'zod';
import { ZodValidationPipe } from 'src/pipes/validation.pipe';
import { PrismaService } from 'src/prisma/prisma.service';
import { compare } from 'bcryptjs';

const authenticateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type AuthenticateSchemaType = z.infer<typeof authenticateSchema>;

@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(authenticateSchema))
  async handle(@Body() body: AuthenticateSchemaType) {
    const { email, password } = body;

    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User credentials are invalid.');
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('User credentials are invalid.');
    }

    const accessToken = this.jwtService.sign({ sub: user.id });

    return {
      access_token: accessToken,
    };
  }
}
