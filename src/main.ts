import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { EnvSchemaT } from './env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService: ConfigService<EnvSchemaT, true> = app.get(ConfigService);
  const port = configService.get('PORT', { infer: true });

  await app.listen(port);
}
bootstrap();
