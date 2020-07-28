import { useState, useEffect, useMemo } from "react";
import request from "superagent";
import { Dataset, Publisher, Distribution } from "../types";

let baseUrl = "/api/apis";
if (process.env.NODE_ENV === "production") {
  baseUrl = "/api/apis";
}

function toLang(l: any): string {
  return l ? l.nb || l.nn || l.en || l : "";
}

function toPublisher(p: any): Publisher {
  return {
    name: toLang(p.name).toLocaleUpperCase(),
    uri: p.uri,
  };
}

function toDistribution(d: any): Distribution {
  return {
    description: d,
    format: d,
  };
}

function toDataset(hit: any): Dataset | null {
  if (!hit.publisher) return null;
  return {
    id: hit.id,
    uri: hit.uri,
    title: toLang(hit.title),
    description: toLang(hit.description),
    keyword: ["API"],
    antall: hit.distribution ? hit.distribution.length : 0,
    publisher: toPublisher(hit.publisher),
    distribution: hit.formats && hit.formats.map(toDistribution),
  };
}

export default function useApis() {
  const [data, setData] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPage = function (page: number) {
      const url = `${baseUrl}?page=${page}&size=100`;
      request
        .get(url)
        .set("Accept", "application/json")
        .then((res) => {
          const datasets = res.body.hits
            .map((hit: any) => toDataset(hit))
            .filter((d: Dataset | null) => !!d);
          setData((data) => [...data, ...datasets]);
          if (datasets.length > 0) {
            getPage(page + 1);
          } else {
            setLoading(false);
          }
        })
        .catch((err) => console.warn(err));
    };

    getPage(0);
  }, []);

  const normalized: Dataset[] = useMemo(() => {
    const obj: any = {};

    data.forEach((d) => {
      obj[d.id] = d;
    });

    return Object.values(obj);
  }, [data]);

  return { apis: normalized, loading };
}
