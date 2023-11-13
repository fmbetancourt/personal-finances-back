import { Injectable, LoggerService as ILoggerService } from '@nestjs/common';
import { addColors, createLogger, format, Logger, transports } from 'winston';
const colors = {
  info: 'green',
  warn: 'yellow',
  error: 'red',
};

@Injectable()
export class LoggerService implements ILoggerService {
  private logger: Logger;
  private header: Record<string, any>;

  constructor() {
    this.logger = createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-dd HH:mm:ss' }),
        format.json(),
      ),
      transports: [
        new transports.Console({
          format: format.combine(format.json()),
        }),
      ],
    });
    addColors(colors);

    this.header = {
      service: process.env.npm_package_name,
      version: process.env.npm_package_version,
      environment: process.env.ENVIRONMENT,
    };
  }

  log(message: any) {
    this.logger.info(`[${this.buildHeaderMessage()}] ->`, {
      message: JSON.stringify(message),
    });
  }

  error(message: any) {
    this.logger.error(`[${this.buildHeaderMessage()}] ->`, {
      message: JSON.stringify(message),
    });
  }

  warn(message: any) {
    this.logger.warn(`[${this.buildHeaderMessage()}] ->`, {
      message: JSON.stringify(message),
    });
  }

  debug?(message: any) {
    this.logger.debug(`[${this.buildHeaderMessage()}] ->`, {
      message: JSON.stringify(message),
    });
  }

  verbose?(message: any) {
    this.logger.verbose(`[${this.buildHeaderMessage()}] ->`, {
      message: JSON.stringify(message),
    });
  }

  private buildHeaderMessage(): string {
    let strHeader = `service=${this.header.service} `;
    strHeader += `version=${this.header.version} `;
    strHeader += `environment=${this.header.environment}`;
    return strHeader;
  }
}
