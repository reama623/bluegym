// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { request } from "../../db";

export default async function handler(req, res) {
  const { method, query, params, body, ...rest } = req;
  if (method === "GET") {
    const { trainer } = query;
    const d = await request(
      "select uid, name, `desc`, category from exercise where trainer_id=?",
      [trainer]
    );
    return res.status(200).json(d);
  }
  if (method === "POST") {
    const { loginuser } = body;
    const d = await request(
      "select id, name, group_id from trainer where id=?",
      [loginuser]
    );
    return res.status(200).json(d);
  }
}
