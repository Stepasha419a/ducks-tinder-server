import { Injectable } from '@nestjs/common';

@Injectable()
export class DateService {
  constructor() {}

  getDateFromUnix(unix: number): Date {
    return new Date(unix * 1000);
  }

  getUnixNow(): number {
    return Math.floor(Date.now() / 1000);
  }

  isUnixBeforeNow(unix: number): boolean {
    return unix - this.getUnixNow() < 0;
  }
}
