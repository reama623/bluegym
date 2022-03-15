import axios from "axios";
import { chain } from "lodash";
import { useContext } from "react";
import useSWR from "swr";
import AppContext from "../core/contexts/AppContext";
import { dateUtil } from "../utils/date";

async function getExercises(_, memberId, { id, group }, startDate, endDate) {
  const { data } = await axios.get(
    `/todayexercise?member_id=${memberId}&trainer_id=${id}&group_name=${group}&start_date=${dateUtil.formatDate(
      startDate,
      "yyyy-MM-dd"
    )}&end_date=${dateUtil.formatDate(endDate, "yyyy-MM-dd")}`
  );
  return data;
}

export default function useTodayExercises(member, startDate, endDate) {
  const user = useContext(AppContext);
  const { data, error } = useSWR(
    member ? [`getTodayExercises`, member.id, user, startDate, endDate] : null,
    getExercises
  );
  return {
    loading: !data && !error,
    data: filteringData(data),
    error,
  };
}

function filteringData(data) {
  return chain(data)
    .map((d, i) => {
      return {
        ...d,
        date: dateUtil.formatDate(new Date(d.date), "yyyy-MM-dd"),
      };
    })
    .groupBy("date")
    .map((values, key) => ({
      key,
      values,
    }))
    .orderBy(["key"], ["desc"])
    .value();
}
