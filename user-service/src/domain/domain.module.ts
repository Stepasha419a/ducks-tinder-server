import { Module } from '@nestjs/common';
import { JwtService } from './service/jwt';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { DateService } from './service/date/date.service';

@Module({
  providers: [JwtService, DateService],
  exports: [JwtService, DateService],
  imports: [NestJwtModule],
})
export class DomainModule {}
