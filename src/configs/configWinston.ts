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

import { transports, format } from 'winston';
import { CustomConfigService } from '../modules/customConfigModule/CustomConfigService';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import * as path from 'path';

export const winstonConfig = (config: CustomConfigService) => ({
  level: 'info', // Уровень логирования по умолчанию
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console({
      level: 'info',
      format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.simple(),
      ),
    }),

    new transports.File({
      filename: path.join(config.LOGGER_FILE_PATH, '%DATE%', 'info.log'),
      level: 'info',
      format: format.combine(format.timestamp(), format.json()),
    }),

    new transports.File({
      filename: path.join(config.LOGGER_FILE_PATH, '%DATE%', 'error.log'),
      level: 'error',
      format: format.combine(format.timestamp(), format.json()),
    }),

    // Файловый транспорт с ротацией
    new DailyRotateFile({
      filename: path.join(config.LOGGER_FILE_PATH, '%DATE%', 'info.log'),
      datePattern: 'YYYY-MM-DD', // Правильный шаблон даты
      zippedArchive: config.LOGGER_IS_ZIP_ARCHIVE,
      maxSize: config.LOGGER_MAX_SIZE,
      maxFiles: config.LOGGER_MAX_FILES,
      level: 'info',
      format: format.combine(format.timestamp(), format.json()),
    }),

    // Файловый транспорт для error логов с ротацией
    new DailyRotateFile({
      filename: path.join(config.LOGGER_FILE_PATH, '%DATE%', 'error.log'),
      datePattern: 'YYYY-MM-DD', // Правильный шаблон даты
      zippedArchive: config.LOGGER_IS_ZIP_ARCHIVE,
      maxSize: config.LOGGER_MAX_SIZE,
      maxFiles: config.LOGGER_MAX_FILES,
      level: 'error',
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
});
