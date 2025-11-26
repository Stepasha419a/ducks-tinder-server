import { Observable } from 'rxjs';
import { CreateUserDto } from 'src/application/user/command';
import { ShortUser } from 'src/infrastructure/user/mapper';

export interface UserProtoService {
  getShortUser(request: GetShortUserRequest): Observable<ShortUser>;
  createUser(request: CreateUserDto): Observable<ShortUser>;
}

export interface GetShortUserRequest {
  id: string;
}
