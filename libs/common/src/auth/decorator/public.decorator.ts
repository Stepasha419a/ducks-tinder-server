import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '@app/common/shared/constant';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
