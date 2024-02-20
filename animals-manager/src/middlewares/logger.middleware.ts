import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const {method, originalUrl } = request;

    this.logger.log(`Request ${method} ${originalUrl} - START`)

    response.on('finish', () => {
      const { statusCode } = response;

      this.logger.log(`Request ${method} ${originalUrl} - ${statusCode} - END`);
    });

    next();
  }
}