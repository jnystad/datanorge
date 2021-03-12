import { NowRequest, NowResponse } from "@now/node";
import request from "superagent";

module.exports = (req: NowRequest, res: NowResponse) => {
  request
    .post("https://search.fellesdatakatalog.digdir.no/datasets")
    .send({ page: req.query.page, size: req.query.size })
    .set("Accept", "application/json")
    .then((r) => {
      res.removeHeader("Cache-Control");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.json(r.body);
    })
    .catch(() => res.status(500));
};
