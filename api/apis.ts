import { NowRequest, NowResponse } from "@now/node";
import request from "superagent";

function toInt(q: string | string[]) {
  return Array.isArray(q) ? parseInt(q[0]) : parseInt(q);
}

module.exports = (req: NowRequest, res: NowResponse) => {
  request
    .post("https://search.fellesdatakatalog.digdir.no/dataservices")
    .send({ page: toInt(req.query.page), size: toInt(req.query.size) })
    .set("Accept", "application/json")
    .then((r) => {
      res.removeHeader("Cache-Control");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.json(r.body);
    })
    .catch(() => res.status(500));
};
