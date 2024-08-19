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
import { DeleteLinkController } from './controllers/delete-link.controller';
import { ListLinksController } from './controllers/list-links.controller';
import { EditLinkController } from './controllers/edit-link.controller';

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
    ListUsersController,
    CreateUserController,
    ShrinkLinkController,
    ListLinksController,
    EditLinkController,
    DeleteLinkController,
  ],
  providers: [PrismaService, ShrinkLinkService],
})
export class AppModule {}
