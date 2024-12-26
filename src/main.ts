/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  try {
    const app = await NestFactory.create(AppModule);

    // Enable CORS with specific configuration
    app.enableCors({
      // origin: 'http://localhost:3000', // FOR DEVELOPMENT
      origin: 'https://jobconnect-frontend.vercel.app', // FOR PRODUCTION
      methods: ['GET,HEAD,PUT,PATCH,POST,DELETE'],
      allowedHeaders: 'Content-Type, Authorization',
      credentials: true, // True if cookies or credentials are required
    });

    // Apply global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Strips properties not in the DTO
        forbidNonWhitelisted: true, // Throws error for unexpected properties
        transform: true, // Transforms plain objects to class instances
      }),
    );

    // Start the server on the specified port
    const port = process.env.PORT || 8080;
    await app.listen(port);

    logger.log(`Server running at: http://localhost:${port}`);
  } catch (error) {
    logger.error('Error starting the server', error);
    process.exit(1);
  }
}

bootstrap();