import { ValidationPipe } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { ValidationError } from 'class-validator';

export const GrpcValidationPipe = new ValidationPipe({
  transform: true,
  whitelist: true,
});
