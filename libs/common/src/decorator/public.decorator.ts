import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '@app/common/constants';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
