import { format, getTime, formatDistanceToNow } from 'date-fns';

// ----------------------------------------------------------------------

export const fDate = (date, newFormat) => {
  const fm = newFormat || 'dd MMM yyyy';

  return date ? format(new Date(date), fm) : '-';
};

export function fDateTime(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy p';

  return date ? format(new Date(date), fm) : '';
}

export function fTimestamp(date) {
  return date ? getTime(new Date(date)) : '';
}

export function fToNow(date) {
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
      })
    : '';
}

export const getTodayDate = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to start of the day
  return today;
};
