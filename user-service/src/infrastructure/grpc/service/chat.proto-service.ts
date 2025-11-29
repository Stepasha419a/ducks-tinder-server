import { Observable } from 'rxjs';

export interface ChatProtoService {
  createChat(CreateChatRequest): Observable<ChatResponse>;
}

export interface CreateChatRequest {
  member_ids: string[];
}

export interface ChatResponse {
  id: string;
  blocked: boolean;
  blockedById?: string;
  createdAt: string;
  updatedAt: string;
}
