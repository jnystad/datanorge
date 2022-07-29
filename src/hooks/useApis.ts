import { useState, useEffect, useMemo } from "react";
import request from "superagent";
import { Dataset, Publisher, Distribution } from "../types";

let baseUrl = "/api/apis";
if (process.env.NODE_ENV === "production") {
  baseUrl = "/api/apis";
}

function toLang(l: any): string {
  return typeof l === "string"
    ? l
    : l
    ? l.nb || l.no || l.nn || l.en || ""
    : "";
}

function toPublisher(p: any): Publisher {
  return {
    name: toLang(p.name).toLocaleUpperCase(),
    uri: p.uri,
  };
}

function toDistribution(urls: string[], desc: string[]): Distribution[] {
  return urls?.map((url, i) => ({
    description: "Beskrivelse",
    accessURL: [desc ? desc[i] : ""],
    downloadURL: [url],
    format: "API",
  }));
}

function toDataset(hit: any): Dataset | null {
  if (!hit.publisher) {
    return null;
  }
  return {
    raw: hit,
    id: hit.id,
    entryUri: `https://data.norge.no/apis/${hit.id}`,
    uri: hit.uri,
    title: toLang(hit.title),
    description: toLang(hit.description),
    keyword: ["API"],
    antall: hit.endpointURL ? hit.endpointURL.length : 0,
    publisher: toPublisher(hit.publisher),
    distribution: toDistribution(hit.endpointURL, hit.endpointDescription),
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
        .catch((err) => {
          setLoading(false);
          console.warn(err);
        });
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
