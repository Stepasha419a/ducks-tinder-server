import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { GeocodeView, MapApi } from 'src/application/user/adapter';
import {
  GetGeocodeRequest,
  getGrpcPackageServiceName,
  GRPC_SERVICE,
  MapProtoService,
} from 'src/infrastructure/grpc/service';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MapApiImplementation implements MapApi {
  private mapGrpcService: MapProtoService;

  constructor(@Inject(GRPC_SERVICE.MAP) private readonly client: ClientGrpc) {}

  private readonly logger = new Logger(MapApiImplementation.name);

  onModuleInit() {
    this.mapGrpcService = this.client.getService<MapProtoService>(
      getGrpcPackageServiceName(GRPC_SERVICE.MAP),
    );
  }
}
