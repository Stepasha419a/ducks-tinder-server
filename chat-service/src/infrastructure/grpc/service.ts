import { ChatService } from './gen/chat.pb';

export enum GRPC_SERVICE {
  CHAT = 'GRPC_CHAT_SERVICE',
  USER = 'GRPC_USER_SERVICE',
}

export const GRPC_SERVICE_CLIENTS = [GRPC_SERVICE.USER];

export const CRITICAL_GRPC_SERVICE_CLIENTS = [];

const info: Record<GRPC_SERVICE, { package: string; service: string }> = {
  [GRPC_SERVICE.CHAT]: {
    package: 'chat',
    service: 'ChatService',
  },
  [GRPC_SERVICE.USER]: {
    package: 'user',
    service: 'UserService',
  },
};

type ChatMethods = Capitalize<keyof ChatService & string>;

export const ChatGrpcServiceEndpoints: Record<ChatMethods, ChatMethods> = {
  CreateChat: 'CreateChat',
};

export function getGrpcPackageName(name: GRPC_SERVICE) {
  return info[name].package;
}

export function getGrpcPackageServiceName(name: GRPC_SERVICE) {
  return info[name].service;
}

export function getIsGrpcServiceCritical(name: GRPC_SERVICE) {
  return Boolean(CRITICAL_GRPC_SERVICE_CLIENTS[name]);
}
