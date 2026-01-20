import { format, isSameYear } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { enUS, ko } from 'date-fns/locale';

const GLOBAL_TIME_ZONE = 'Asia/Seoul';

function isDifferentYear(date: Date, now: Date = new Date()) {
  return !isSameYear(date, now);
}

function parseEventDate(
  eventDate: Date,
  options?: {
    formatStyle: 'korean' | 'english';
  }
) {
  const zonedDate = toZonedTime(eventDate, GLOBAL_TIME_ZONE);
  const minutes = zonedDate.getMinutes();
  if (options?.formatStyle === 'english') {
    const timeFormat = (() => {
      if (isDifferentYear(zonedDate)) {
        return 'MMM dd, yyyy, h:mm a';
      }
      return 'MMM dd, h:mm a';
    })();
    return format(zonedDate, timeFormat, { locale: enUS });
  }
  const timeFormat = (() => {
    if (isDifferentYear(zonedDate)) {
      return minutes === 0
        ? 'EEEE a h시, yyyy년 MMMM d일'
        : 'EEEE a h시 m분, yyyy년 MMMM d일';
    }
    return minutes === 0 ? 'EEEE a h시, MMMM d일' : 'EEEE a h시 m분, MMMM d일';
  })();
  return format(zonedDate, timeFormat, { locale: ko });
}

export const dateUtils = {
  parseEventDate,
};
