/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  try {
    const app = await NestFactory.create(AppModule);

    // Enable CORS
    app.enableCors({
      origin: '*', // Replace '*' with specific origins for better security
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true, // Set to true if cookies or other credentials are required
    });

    // Global Validation Pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Strips unallowed properties
        forbidNonWhitelisted: true, // Throws an error if non-whitelisted properties are present
        transform: true, // Automatically transform payloads to DTO classes
      }),
    );

    // Start the server
    const port = process.env.PORT || 8080;
    await app.listen(port);

    logger.log(`Server running at: http://localhost:${port}`);
  } catch (error) {
    logger.error('Error starting the server', error);
    process.exit(1);
  }
}

bootstrap();
