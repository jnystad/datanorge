import { useState, useEffect, useMemo } from "react";
import request from "superagent";
import { Dataset, Publisher, Distribution } from "../types";

let baseUrl = "/datasets";
if (process.env.NODE_ENV === "production") {
  baseUrl = "/api/datasets";
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
    description: toLang(d.description),
    downloadURL: d.downloadURL,
    accessURL: d.accessURL,
    format: d.format,
  };
}

function toDataset(hit: any): Dataset | null {
  if (!hit.publisher) return null;
  return {
    id: hit.id,
    entryUri: `https://data.norge.no/datasets/${hit.id}`,
    uri: hit.uri,
    title: toLang(hit.title),
    description: toLang(hit.description),
    keyword: (hit.keyword && hit.keyword.map(toLang)) || [],
    antall: hit.distribution ? hit.distribution.length : 0,
    publisher: toPublisher(hit.publisher),
    distribution: hit.distribution && hit.distribution.map(toDistribution),
  };
}

export default function useDatasets() {
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
        .catch((err) => console.warn(err, baseUrl));
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

  return { datasets: normalized, loading };
}
