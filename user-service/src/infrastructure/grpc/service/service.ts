export enum GRPC_SERVICE {
  FILE = 'GRPC_FILE_SERVICE',
  MAP = 'GRPC_MAP_SERVICE',
  CHAT = 'GRPC_CHAT_SERVICE',
  USER = 'GRPC_USER_SERVICE',
}

export const GRPC_SERVICE_CLIENTS = [
  GRPC_SERVICE.FILE,
  GRPC_SERVICE.CHAT,
  GRPC_SERVICE.MAP,
];

const info: Record<GRPC_SERVICE, { package: string; service: string }> = {
  [GRPC_SERVICE.FILE]: {
    package: 'file',
    service: 'FileService',
  },
  [GRPC_SERVICE.MAP]: {
    package: 'map',
    service: 'MapService',
  },
  [GRPC_SERVICE.CHAT]: {
    package: 'chat',
    service: 'ChatService',
  },
  [GRPC_SERVICE.USER]: {
    package: 'user',
    service: 'UserService',
  },
};

export enum UserGrpcServiceEndpoint {
  CreateUser = 'CreateUser',
  GetShortUser = 'GetShortUser',
}

export function getGrpcPackageName(name: GRPC_SERVICE) {
  return info[name].package;
}

export function getGrpcPackageServiceName(name: GRPC_SERVICE) {
  return info[name].service;
}
