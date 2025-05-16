import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

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

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3001;
  await app.listen(port);
  console.log(`API Gateway listening on port ${port}`);
}
bootstrap().catch((err) => {
  console.error('Error bootstrapping the application:', err);
  process.exit(1);
});
