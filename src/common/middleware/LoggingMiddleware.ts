import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CustomLoggerService } from '../../modules/logger/logger.service';
import { ILogMeta } from '../../interfaces/ILogMeta';
import { AuthService } from '../../modules/auth/auth.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logMeta: ILogMeta;
  private username;
  constructor(
    private logger: CustomLoggerService,
    private authService: AuthService,
  ) {
    this.logMeta = { context: LoggerMiddleware.name };
  }

  use(req: Request, res: Response, next: NextFunction) {
    this.username = 'Anonymous';
    const { method, originalUrl: url, ip } = req;

    const authHeader = req.headers.authorization;

    if (authHeader) {
      const payload = this.authService.getPayload(req);
      this.username = payload?.username || this.username;
    }

    const userAgent = req.get('user-agent') || '';
    const timestamp = new Date().toISOString();

    // Log incoming request
    this.logger.log(
      `Request ip:${ip} ${userAgent} [user:${this.username}] ${method} ${url}`,
      this.logMeta,
    );

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
