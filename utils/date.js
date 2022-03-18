import {
  endOfMonth,
  endOfWeek,
  format,
  setMonth,
  setWeek,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ko } from "date-fns/locale";

const locale = ko;

function today() {
  return format(new Date(), "PPP", { locale });
}

function formatDate(date, formatString = "yyyy-MM-dd") {
  return format(new Date(date), formatString);
}

function getRangeOfMonth(month, formatString) {
  const monthDate = setMonth(new Date(), month);
  const start = formatString
    ? format(startOfMonth(monthDate), formatString)
    : startOfMonth(monthDate);
  const end = format
    ? format(endOfMonth(monthDate), formatString)
    : endOfMonth(monthDate);
  return { start, end };
}

function getRangeOfWeek(week, formatString) {
  const weekDate = setWeek(new Date(), week);
  const start = formatString
    ? format(startOfWeek(weekDate), formatString)
    : startOfWeek(weekDate);
  const end = formatString
    ? format(endOfWeek(weekDate), formatString)
    : endOfWeek(weekDate);
  return { start, end };
}

export const dateUtil = {
  today,
  formatDate,
  getRangeOfMonth,
  getRangeOfWeek,
};
