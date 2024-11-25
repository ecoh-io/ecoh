import dayjs from '@/src/utils/dayjs';

export const getShortTimeAgo = (timestamp: string | number | Date): string => {
  const now = dayjs();
  const time = dayjs(timestamp);
  const diffInSeconds = now.diff(time, 'second');
  if (diffInSeconds < 60) return `${diffInSeconds}s`;

  const diffInMinutes = now.diff(time, 'minute');
  if (diffInMinutes < 60) return `${diffInMinutes}m`;

  const diffInHours = now.diff(time, 'hour');
  if (diffInHours < 24) return `${diffInHours}h`;

  const diffInDays = now.diff(time, 'day');
  if (diffInDays < 30) return `${diffInDays}d`;

  const diffInMonths = now.diff(time, 'month');
  if (diffInMonths < 12) return `${diffInMonths}mo`;

  const diffInYears = now.diff(time, 'year');
  return `${diffInYears}y`;
};
