import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import appConfig from './config/app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  await app.listen(appConfig.port);
}
bootstrap();
