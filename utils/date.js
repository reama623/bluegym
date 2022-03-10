import { format } from "date-fns";
import { ko } from "date-fns/locale";

const locale = ko;

function today() {
  return format(new Date(), "PPP", { locale });
}

function formatDate(date, formatString = "yyyy-MM-dd") {
  return format(new Date(date), formatString);
}

export const dateUtil = {
  today,
  formatDate,
};
