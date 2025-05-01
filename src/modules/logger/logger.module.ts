import { Module } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER, WinstonModule } from 'nest-winston';
import { CustomConfigModule } from '../customConfigModule/CustomConfigModule';
import { CustomConfigService } from '../customConfigModule/CustomConfigService';
import { winstonConfig } from '../../configs/configWinston';
import { CustomLoggerService } from './logger.service';

@Module({
  imports: [
    CustomConfigModule,
    WinstonModule.forRootAsync({
      imports: [CustomConfigModule],
      inject: [CustomConfigService],
      useFactory: (config: CustomConfigService) => winstonConfig(config),
    }),
  ],
  providers: [
    {
      provide: CustomLoggerService,
      useFactory: (logger) => new CustomLoggerService(logger),
      inject: [WINSTON_MODULE_PROVIDER],
    },
  ],
  exports: [CustomLoggerService],
})
export class CustomLoggerModule {}
