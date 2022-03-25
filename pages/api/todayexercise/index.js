import { escape } from "mysql2";
import { request } from "../../../db";

export default async function handler(req, res) {
  const { query, method, body } = req;

  if (method === "GET") {
    const d = await selectTodayExeriseOfUser(query);
    return res.status(200).json(d);
  }

  if (method === "POST") {
    const d = await insertTodayExercise(body);

    return res.status(201).json(d);
  }
  return res.status(200).json([]);
}

const selectTodayExeriseOfUser = async ({
  member_id,
  trainer_id,
  group_name,
  start_date,
  end_date,
}) => {
  const q = `select te.seq, te.date,e.name, te.date, te.exercise_desc as value from today_exercise te join exercise e on e.seq = te.exercise_seq where member_id=? and te.trainer_id=? and group_name=? and date between ? and ?`;
  const d = await request(q, [
    member_id,
    trainer_id,
    group_name,
    start_date,
    end_date,
  ]);
  return d;
};

const insertTodayExercise = async (exercises) => {
  const values = exercises
    .map(
      ({
        member_id,
        trainer_id,
        group_name,
        exercise_seq,
        date,
        exercise_desc,
        exercise_type,
      }) =>
        `(${escape(member_id)}, ${escape(trainer_id)}, ${escape(
          group_name
        )}, ${exercise_seq}, ${escape(date)}, ${escape(
          exercise_desc
        )}, ${exercise_type})`
    )
    .join(",");
  const q = `insert into today_exercise (member_id, trainer_id, group_name, exercise_seq, date, exercise_desc, exercise_type) values ${values}`;
  const d = await request(q);
  return d;
};
