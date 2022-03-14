import { escape } from "mysql2";
import { request } from "../../../db";

export default async function handler(req, res) {
  const { query, method, body } = req;

  if (method === "GET") {
  }

  if (method === "POST") {
    const d = await insertTodayExercise(body);

    return res.status(201).json(d);
  }
}

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
  const query = `insert into today_exercise (member_id, trainer_id, group_name, exercise_seq, date, exercise_desc, exercise_type) values ${values}`;
  const d = await request(query);
  return d;
};
