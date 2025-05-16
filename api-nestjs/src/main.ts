import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable ValidationPipe globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Eliminate properties that are not in the DTO
      forbidNonWhitelisted: true, // Throw error if there are unexpected properties
      transform: true, // Transform the payload to the DTO type
      transformOptions: {
        enableImplicitConversion: true, // Allow implicit type conversion (e.g. string from query param to number)
      },
    }),
  );

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap(); 