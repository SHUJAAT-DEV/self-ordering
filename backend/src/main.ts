import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import * as compression from 'compression';
import { join } from 'path';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;
  const globalPrefix = configService.get<string>('GLOBAL_PREFIX') || 'api/v1';

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: false, // Disable for development
    crossOriginEmbedderPolicy: false
  }));

  // Compression
  app.use(compression());

  // CORS configuration
  app.enableCors();
  // Global prefix for all routes
  app.setGlobalPrefix(globalPrefix);

  // Static files for uploads
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  // Global filters and interceptors can be added later
  // app.useGlobalFilters(new HttpExceptionFilter());
  // app.useGlobalInterceptors(new LoggingInterceptor());
  // app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger documentation
  if (configService.get<string>('NODE_ENV') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle(configService.get<string>('SWAGGER_TITLE') || 'Restaurant Ordering API')
      .setDescription(configService.get<string>('SWAGGER_DESCRIPTION') || 'API documentation for Restaurant Self-Ordering System')
      .setVersion(configService.get<string>('SWAGGER_VERSION') || '1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth'
      )
      .addTag(configService.get<string>('SWAGGER_TAG') || 'restaurant-api')
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }

  await app.listen(port);
  
  console.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/docs`);
  console.log(`🌍 Environment: ${configService.get<string>('NODE_ENV')}`);
  console.log(`🗄️  Database: ${configService.get<string>('DB_NAME')}`);
}

bootstrap().catch((error) => {
  console.error('Error starting application:', error);
  process.exit(1);
});