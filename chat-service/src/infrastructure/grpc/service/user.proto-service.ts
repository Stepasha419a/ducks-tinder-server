import { Observable } from 'rxjs';
import { ChatMemberView } from 'src/application/adapter/user-api/view';

export interface UserProtoService {
  getShortUser(request: GetShortUserRequest): Observable<ChatMemberView>;
  createUser(request: CreateUserRequest): Observable<ChatMemberView>;
}

export interface GetShortUserRequest {
  id: string;
}

export class CreateUserRequest {
  id: string;
  name: string;
}
