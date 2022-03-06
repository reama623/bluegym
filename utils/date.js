import { format } from "date-fns";
import { ko } from "date-fns/locale";

const locale = ko;

function today() {
  return format(new Date(), "PPP", { locale });
}

function foramtDate(date, format = "yyyy-MM-dd") {
  return format(new Date(date), format);
}

export const date = {
  today,
  foramtDate,
};
