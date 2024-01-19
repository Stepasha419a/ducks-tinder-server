import { HOUR_IN_MS } from '@app/common/constants';

export function getDatesHourDiff(date1: Date, date2: Date): number {
  return new Date(date1.getTime() - date2.getTime()).getTime() / HOUR_IN_MS;
}