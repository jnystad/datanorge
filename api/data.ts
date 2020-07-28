import { NowRequest, NowResponse } from "@now/node";
import request from "superagent";

module.exports = (req: NowRequest, res: NowResponse) => {
  request
    .get("https://fellesdatakatalog.digdir.no/datasets")
    .set("Accept", "application/json")
    .then((r) => {
      res.removeHeader("Cache-Control");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.json(r.body);
    })
    .catch(() => res.status(500));
};
