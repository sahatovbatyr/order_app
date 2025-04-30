import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CustomLoggerService } from '../../modules/logger/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private logger: CustomLoggerService) {
    this.logger.setContext(LoggerMiddleware.name);
    console.log(`CREATED ${this.logger.getContext()}`);
  }

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl: url, ip } = req;
    const userAgent = req.get('user-agent') || '';

    const username = (req as any).user?.username || 'Anonymous';
    const timestamp = new Date().toISOString();

    // Log incoming request
    this.logger.info(
      `Request ${timestamp}: [user:${username}] ${method} ${url}`,
      {
        // context: LoggerMiddleware.name,
        timestamp: timestamp,
        method,
        url,
        ip,
        userAgent,
        username: username,
      },
    );
    // {
    //   context: 'HTTP',
    //     method,
    //     url: originalUrl,
    //   ip,
    //   userAgent,
    // }

    const start = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      const responseTime = Date.now() - start;

      // this.logger.info('Request completed', {
      //   context: 'HTTP',
      //   method,
      //   url: originalUrl,
      //   statusCode,
      //   contentLength,
      //   responseTime: `${responseTime}ms`,
      // });
    });

    next();
  }
}
