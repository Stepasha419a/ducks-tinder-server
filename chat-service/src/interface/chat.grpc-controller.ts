import { Controller, Logger, UsePipes } from '@nestjs/common';
import { ChatFacade } from 'src/application';
import { GrpcMethod } from '@nestjs/microservices';
import {
  ChatGrpcServiceEndpoints,
  getGrpcPackageServiceName,
  GRPC_SERVICE,
} from 'src/infrastructure/grpc/service';
import { chat } from 'src/infrastructure/grpc/gen';
import { CreateChatGrpcDto, GrpcValidationPipe } from './common';

@Controller()
@UsePipes(GrpcValidationPipe)
export class ChatGrpcController {
  constructor(private readonly facade: ChatFacade) {}
}
