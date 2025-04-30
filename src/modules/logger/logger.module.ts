// import { Module } from '@nestjs/common';
// import { WinstonModule } from 'nest-winston';
// import * as winston from 'winston';
// import * as DailyRotateFile from 'winston-daily-rotate-file';
// import { CustomConfigModule } from '../customConfigModule/CustomConfigModule';
// import { CustomConfigService } from '../customConfigModule/CustomConfigService';
// import { WinstonCustomLoggerProvider } from './WinstonCustomLoggerProvider';
//
// @Module({
//   imports: [
//     WinstonModule.forRootAsync({
//       imports: [CustomConfigModule],
//       inject: [CustomConfigService],
//       useFactory: (config: CustomConfigService) => ({
//         transports: [
//           // Консольный транспорт
//           new winston.transports.Console({
//             level: 'info',
//             format: winston.format.combine(
//               winston.format.timestamp(),
//               winston.format.ms(),
//               winston.format.printf(({ level, message, timestamp, ms }) => {
//                 return `${timestamp} ${level} [${ms}] ${message}`;
//               }),
//             ),
//           }),
//
//           // Файловый транспорт с ротацией
//           new DailyRotateFile({
//             filename: config.LOGGER_FILE_PATH,
//             datePattern: 'YYYY-MM-DD',
//             zippedArchive: config.LOGGER_IS_ZIP_ARCHIVE,
//             maxSize: config.LOGGER_MAX_SIZE,
//             maxFiles: config.LOGGER_MAX_FILES,
//             format: winston.format.combine(
//               winston.format.timestamp(),
//               winston.format.json(),
//             ),
//           }),
//         ],
//       }),
//     }),
//   ],
//   providers: [WinstonCustomLoggerProvider],
//   exports: [WinstonModule, WinstonCustomLoggerProvider],
// })
// export class LoggerModule {}

import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
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
      useFactory: (config: CustomConfigService) => winstonConfig(config), // Используем конфигурацию
    }),
  ],
  providers: [CustomLoggerService],
  exports: [CustomLoggerService], // Экспортируем сервис
})
export class CustomLoggerModule {}
