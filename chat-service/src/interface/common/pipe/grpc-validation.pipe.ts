import { ValidationPipe } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { ValidationError } from 'class-validator';

export const GrpcValidationPipe = new ValidationPipe({
  transform: true,
  whitelist: true,

  exceptionFactory: (errors: ValidationError[]) => {
    const messages = errors.map((error) => {
      const constraints = Object.values(error.constraints || {});
      return `${error.property}: ${constraints.join(', ')}`;
    });

    const errorMessage = `Validation failed: ${messages.join('; ')}`;

    return new RpcException({
      code: status.INVALID_ARGUMENT,
      message: errorMessage,
    });
  },
});
