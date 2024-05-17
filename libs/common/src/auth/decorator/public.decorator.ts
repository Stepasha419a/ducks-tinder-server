import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../../../../../chat-service/src/application/guard/constant';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
