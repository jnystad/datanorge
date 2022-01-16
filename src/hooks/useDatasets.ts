import { useState, useEffect, useMemo } from "react";
import request from "superagent";
import { Dataset, Publisher, Distribution } from "../types";

const baseUrl = "/api/datasets";

function toLang(l: any): string {
  return l ? l.no || l.nb || l.nn || l.en || l : "";
}

function toPublisher(p: any): Publisher {
  const publisher = {
    name: toLang(p.name).toLocaleUpperCase(),
    uri: p.uri,
  };

  if (!publisher.name) {
    if (p.uri?.indexOf("geonorge") >= 0) {
      publisher.name = "STATENS KARTVERK";
    } else {
      publisher.name = "UKJENT";
    }
  }

  return publisher;
}

function toDistribution(d: any): Distribution {
  return {
    description: toLang(d.description),
    downloadURL: d.downloadURL,
    accessURL: d.accessURL,
    format: d.format
      ? Array.isArray(d.format)
        ? d.format.map(mapFormat)
        : mapFormat(d.format)
      : null,
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
    publisher: toPublisher(hit.publisher) || "Ingen",
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

  return { datasets: normalized, loading };
}

function mapFormat(format: string) {
  format = format
    .replace("https://www.iana.org/assignments/media-types/", "")
    .replace("https://publications.europa.eu/resource/authority/file-type/", "")
    .replace("-format", "")
    .trim();

  switch (format) {
    case "application/g-tar":
    case "application/x-gtar":
      return "GzTAR";
    case "image/tiff":
    case "TIFF":
      return "TIFF";
    case "GDB":
      return "GDB";
    case "application/vnd.google-earth.kmz+xml":
      return "KMZ";
    case "application/x-­ogc-sosi":
    case "application/x-ogc-sosi":
    case "text/vnd.sosi":
      return "SOSI";
    case "ESRI Shape":
    case "Shape":
    case "Shapefile":
    case "application/vnd.shp":
      return "Shape";
    case "KML":
    case "application/vnd.google-earth.kml+xml":
      return "KML";
    case "GeoJSON":
    case "GEOJSON":
    case "application/geo+json":
    case "application/vnd.geo+json":
      return "GeoJSON";
    case "GPX":
    case "application/gpx+xml":
      return "GPX";
    case "GML":
    case "application/gml+xml":
      return "GML";
    case "application/rss+xml":
      return "RSS";
    case "application/sql":
      return "SQL";
    case "Zip":
    case "ZIP":
    case "application/zip":
      return "Zip";
    case "application/vnd.rar":
      return "RAR";
    case "application/ld+json":
      return "LDJSON";
    case "text/turtle":
      return "Turtle";
    case "RDF":
    case "application/rdf+xml":
      return "RDF";
    case "WMS":
    case "OGC WMS":
    case "application/x.wms":
      return "WMS";
    case "WFS":
    case "OGC WFS":
    case "application/x.wfs":
      return "WFS";
    case "application/x.yaml":
      return "YAML";
    case "application/javascript":
      return "JS";
    case "PDF":
    case "application/pdf":
      return "PDF";
    case "application/vnd.oasis.opendocument.spreadsheet":
      return "ODS";
    case "XLS":
    case "application/vnd.sealed-xls":
      return "XLS";
    case "XLSX":
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return "XLSX";
    case "text/html":
      return "HTML";
    case "text/plain":
      return "Text";
    case "XML":
    case "application/xml":
    case "text/xml":
      return "XML";
    case "CSV":
    case "text/csv":
      return "CSV";
    case "JSON":
    case "application/json":
      return "JSON";
    default:
      return format;
  }
}
