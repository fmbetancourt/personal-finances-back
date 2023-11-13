import * as dotenv from 'dotenv';
dotenv.config();

import { Logger } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './infrastructure/common/exceptions/http-exception.filter';

async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.create(AppModule);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Environment: ${process.env.ENVIRONMENT}`);
  logger.log(`Server Start Port ${port}`);
}

bootstrap().then(() => {});
