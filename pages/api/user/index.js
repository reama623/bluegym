import { request } from "../../../db";

export default async function handler(req, res) {
  const { method, query, body } = req;

  if (method === "GET") {
    const { trainer } = query;
    const data = await getUsers(trainer);

    return res.status(200).json(data);
  }

  return res.status(500).json({ message: "잘못된 요청입니다." });
}

const getUsers = async (trainer) => {
  const d = await request(
    `select uid, id, name, created_at, group_id as \`group\` from user where trainer_id=?`,
    [trainer]
  );
  return d;
};
