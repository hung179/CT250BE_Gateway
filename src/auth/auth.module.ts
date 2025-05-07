import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AdminLocalStrategy } from './strategies/admin-local.strategy';
import { CustomerLocalStrategy } from './strategies/customer-local.strategy';
import { RedisCacheModule } from 'src/redisCache/redisCache.module';
import { ConfigService } from '@nestjs/config';
import { AdminGuard } from './guards/admin-guard';
import { AdminOnlyGuard } from './guards/admin-only.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AdminModule } from 'src/microservices/admin/admin.module';
import { CustomerModule } from 'src/microservices/customer/customer.module';
import { EmailModule } from 'src/email/email.module';
import { OtpModule } from 'src/otp/otp.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    RedisCacheModule,
    AdminModule,
    CustomerModule,
    EmailModule,
    OtpModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    AdminLocalStrategy,
    CustomerLocalStrategy,
    JwtAuthGuard,
    AdminGuard,
    AdminOnlyGuard
  ],
  exports: [JwtAuthGuard, AdminGuard, AdminOnlyGuard, JwtModule],
})
export class AuthModule {}