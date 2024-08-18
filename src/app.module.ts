import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { CreateUserController } from './controllers/create-user.controller';
import { envSchema } from './env';
import { Authmodule } from './auth/auth.module';
import { AuthenticateController } from './controllers/authenticate.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: env => envSchema.parse(env),
      isGlobal: true,
    }),
    Authmodule,
  ],
  controllers: [CreateUserController, AuthenticateController],
  providers: [PrismaService],
})
export class AppModule {}
