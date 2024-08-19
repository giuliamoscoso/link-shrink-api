import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { CreateUserController } from './controllers/create-user.controller';
import { envSchema } from './env';
import { Authmodule } from './auth/auth.module';
import { AuthenticateController } from './controllers/authenticate.controller';
import { ShrinkLinkController } from './controllers/shrink-link.controller';
import { ListUsersController } from './controllers/list-users.controller';
import { ShrinkLinkService } from './shrinker/shrink-link.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: env => envSchema.parse(env),
      isGlobal: true,
    }),
    Authmodule,
  ],
  controllers: [
    AuthenticateController,
    CreateUserController,
    ShrinkLinkController,
    ListUsersController,
  ],
  providers: [PrismaService, ShrinkLinkService],
})
export class AppModule {}
