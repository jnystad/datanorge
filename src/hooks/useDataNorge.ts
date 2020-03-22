import { useState, useEffect, useMemo } from "react";
import request from "superagent";
import { Dataset } from "../types";

export default function useDataNorge() {
  const [data, setData] = useState<Dataset[]>([]);

  useEffect(() => {
    const getPage = function(page: number) {
      const url = `/api/dcat/data.json?page=${page}`;
      request.get(url).then(res => {
        const datasets = res.body.datasets;
        setData(data => [...data, ...datasets]);
        if (datasets.length > 0) getPage(page + 1);
      });
    };

    getPage(1);
  }, []);

  const normalized: Dataset[] = useMemo(() => {
    const obj: any = {};

    data.forEach(d => {
      obj[d.id] = d;
    });

    return Object.values(obj);
  }, [data]);

  return normalized;
}