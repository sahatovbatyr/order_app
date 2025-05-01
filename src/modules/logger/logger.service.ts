import { Inject, Injectable } from '@nestjs/common';
import { LoggerService } from '@nestjs/common';
import { Logger as WinstonLogger } from 'winston';

import { ILogMeta } from '../../interfaces/ILogMeta';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class CustomLoggerService implements LoggerService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly winstonLogger: WinstonLogger,
  ) {}

  log(message: string, meta: ILogMeta = {}) {
    this.winstonLogger.info(message, {
      ...meta,
      context: meta.context || 'App',
    });
  }

  error(message: string, trace: string, meta: ILogMeta = {}) {
    this.winstonLogger.error(message, {
      ...meta,
      stack: trace,
      context: meta.context || 'App',
    });
  }

  warn(message: any, meta: ILogMeta = {}) {
    return this.winstonLogger.warn(message, {
      ...meta,
      context: meta.context || 'App',
    });
  }
}
