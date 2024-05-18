export class DateUtil {
  public static getDatesHourDiff(date1: Date, date2: Date): number {
    return (
      new Date(date1.getTime() - date2.getTime()).getTime() / this.HOUR_IN_MS
    );
  }

  private static readonly HOUR_IN_MS = 3_600_000;
}
