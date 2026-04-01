import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { rateLimitMiddleware } from 'common/rate-limit/rate-limit-middleware';
import { setupSwagger } from 'common/swagger/setup.swagger';

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
    console.log(`Server is running on port ${PORT}`);
    console.log(
      `Swagger documentation available at http://localhost:${PORT}/api-docs`,
    );
  });
}
bootstrap();
