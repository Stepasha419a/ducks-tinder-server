export enum GRPC_SERVICE {
  FILE = 'GRPC_FILE_SERVICE',
}

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
