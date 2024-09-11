package time_service

import "time"

func ParseISOString(timeString string) (time.Time, error) {
	return time.Parse("2006-01-02T15:04:05-0700", timeString)
}
