import { Module } from '@nestjs/common';
import { JwtService } from './service/jwt';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';

@Module({
  providers: [JwtService],
  exports: [JwtService],
  imports: [NestJwtModule],
})
export class DomainModule {}
