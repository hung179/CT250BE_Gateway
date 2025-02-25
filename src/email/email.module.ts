import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [],
  exports: [EmailService],
  providers: [EmailService],
})
export class EmailModule {}
