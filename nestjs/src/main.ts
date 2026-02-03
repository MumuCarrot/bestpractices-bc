import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { LoggerService } from './core/logger/logger.service';
import { LoggerInterceptor } from './core/logger/logger.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Get logger service
  const logger = app.get(LoggerService);

  // Enable cookie parser middleware
  app.use(cookieParser());

  // Use global logger interceptor for HTTP requests
  app.useGlobalInterceptors(new LoggerInterceptor(logger));

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3000;
  await app.listen(port);
  logger.info(`Application is running on: http://localhost:${port}`);
}
bootstrap();
