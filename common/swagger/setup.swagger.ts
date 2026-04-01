import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Passenger Transportation API')
    .setDescription(
      'This documentation provides a detailed description of an API for passenger transportation, similar to services like Uber, including multiple security schemes and environment configurations (development, staging, production).',
    )
    .setVersion('2.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter the JWT token. Example: Bearer <token>',
      },
      'access-token',
    )
    .addServer('http://localhost:3000', 'Development Environment')
    .addServer('https://staging.api.example.com', 'Staging Environment')
    .addServer('https://api.example.com', 'Production Environment')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
    },
  });
}
