import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { rateLimitMiddleware } from 'common/rate-limit/rate-limit-middleware';
import { setupSwagger } from 'common/swagger/setup.swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.getHttpAdapter().getInstance().set('trust proxy', 1);
  app.use(helmet());
  app.use(rateLimitMiddleware);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors();

  setupSwagger(app);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    const logger = new Logger('NestRun');
    logger.log(`🚀 Server running at ${PORT}`);
    logger.log(`📄 Swagger docs at ${PORT}/api-docs`);
  });
}
bootstrap();
