import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { LoggerService } from '../logger/logger.service';
import { isJSON } from 'class-validator';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private environment = process.env.ENVIRONMENT;
  private logger = new LoggerService();

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const error: Record<string, any> =
      exception instanceof HttpException ? exception.message : exception;
    this.logger.error(error);

    let status;
    if (exception.status) {
      status = exception.status;
    } else if (exception.response) {
      status = exception.response.status || exception.response.statusCode;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    if (this.environment === 'production') {
      return response.status(status).json({
        status,
        statusDescription: '',
      });
    }

    const statusDescription = isJSON(error) ? JSON.stringify(error) : error;
    const url = request.url;

    return response.status(status).json({
      status,
      statusDescription,
      url,
    });
  }
}
