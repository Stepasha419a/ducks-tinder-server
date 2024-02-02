import { CONSTANT } from '../constant';

export class DateUtil {
  public static getDatesHourDiff(date1: Date, date2: Date): number {
    return (
      new Date(date1.getTime() - date2.getTime()).getTime() /
      CONSTANT.HOUR_IN_MS
    );
  }
}
