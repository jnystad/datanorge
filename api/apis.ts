import { VercelRequest, VercelResponse } from "@vercel/node";

function toInt(q: string | string[]) {
  return Array.isArray(q) ? parseInt(q[0]) : parseInt(q);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const response = await fetch(
      "https://search.fellesdatakatalog.digdir.no/dataservices",
      {
        method: "POST",
        body: JSON.stringify({
          page: toInt(req.query.page),
          size: toInt(req.query.size),
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    res.removeHeader("Cache-Control");
    res.setHeader("Cache-Control", "public, max-age=86400");
    return res.json(data);
  } catch (ex) {
    console.error(ex);
    return res.status(500);
  }
}
