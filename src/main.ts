import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3000'], // Chỉ cho phép frontend này gọi API
    credentials: true, // Cho phép gửi cookie & header xác thực
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  const redisMicroservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.REDIS,
      options: {
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
        db: 1,
      },
    });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await redisMicroservice.listen();
  await app.listen(process.env.PORT || 3999, '0.0.0.0');
}
bootstrap();
