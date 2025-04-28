import { Injectable, Scope } from '@nestjs/common';
import { LoggerService } from '@nestjs/common';
import { createLogger, Logger } from 'winston';
import { CustomConfigService } from '../customConfigModule/CustomConfigService';
import { winstonConfig } from '../../configs/configWinston';

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLoggerService implements LoggerService {
  private context?: string;
  private winstonLogger: Logger;

  constructor(private configService: CustomConfigService) {
    console.log('**CREATING LOGGER ***************');
    this.setContext('CustomLoggerService');
    console.log(`CREATED ${this.context}`);

    try {
      this.winstonLogger = createLogger(winstonConfig(this.configService));
    } catch (err) {
      console.log('ERRRRRRRRRRRRRRR. ' + err);
    }
  }

  public setContext(context: string) {
    console.log('********************************');
    console.log(context);
    this.context = context;
  }

  public getContext() {
    return this.context;
  }

  log(message: any, context?: string) {
    return this.winstonLogger.info(message, {
      context: context || this.context,
    });
  }

  info(message: any, context?: object) {
    return this.winstonLogger.info(message, {
      context: context || this.context,
    });
  }

  error(message: any, trace?: string, context?: string): any {
    return this.winstonLogger.error(message, {
      trace,
      context: context || this.context,
    });
  }

  warn(message: any, context?: string): any {
    return this.winstonLogger.warn(message, {
      context: context || this.context,
    });
  }

  debug(message: any, context?: string): any {
    return this.winstonLogger.debug(message, {
      context: context || this.context,
    });
  }

  verbose(message: any, context?: string): any {
    return this.winstonLogger.verbose(message, {
      context: context || this.context,
    });
  }
}
