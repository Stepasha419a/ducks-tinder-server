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
};

export function getGrpcPackageName(name: GRPC_SERVICE) {
  return info[name].package;
}

export function getGrpcPackageServiceName(name: GRPC_SERVICE) {
  return info[name].service;
}
