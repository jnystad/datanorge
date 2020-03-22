import { NowRequest, NowResponse } from "@now/node";
import request from "superagent";

module.exports = (req: NowRequest, res: NowResponse) => {
  request
    .get("https://data.norge.no/api/dcat/data.json?page=" + req.query.page)
    .then(r => {
      res.removeHeader("Cache-Control");
      res.setHeader("Cache-Control", "public, max-age=3600");
      res.json(r.body);
    })
    .catch(() => res.status(500));
};
