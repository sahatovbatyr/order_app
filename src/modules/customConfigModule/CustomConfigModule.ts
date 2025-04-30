import { CustomConfigService } from './CustomConfigService';
import { Module } from '@nestjs/common';

@Module({
  providers: [CustomConfigService],
  exports: [CustomConfigService],
})
export class CustomConfigModule {}
