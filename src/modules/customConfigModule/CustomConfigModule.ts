import { ConfigModule } from '@nestjs/config';
import { CustomConfigService } from './CustomConfigService';
import { Module } from '@nestjs/common';

@Module({
  imports: [ConfigModule],
  providers: [CustomConfigService],
  exports: [CustomConfigService], // 👈 важно!
})
export class CustomConfigModule {}
