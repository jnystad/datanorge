import { useState, useEffect } from "react";
import axios from "axios";
import { Dataset } from "../types/Dataset";

export default function useDatasets(limit = 20, offset = 0, q?: string, publisher?: string) {
  const [data, setData] = useState<{
    data: Dataset[];
    total: number;
    aggregations: { publishers: { name: string; count: number }[] };
  }>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function get() {
      setLoading(true);
      const res = await axios.get(q ? "/api/search" : "/api/list", {
        params: {
          limit,
          offset,
          q,
          publisher: publisher ? publisher : undefined,
        },
      });
      setData(res.data);
      setLoading(false);
    }
    get();
  }, [limit, offset, q, publisher]);

  return {
    datasets: data?.data ?? [],
    loading,
    total: data?.total ?? 0,
    aggregations: data?.aggregations ?? { publishers: [] },
  };
}
