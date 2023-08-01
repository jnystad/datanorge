const fs = require("fs/promises");
const { post } = require("./lib/request");

const apisUrl = "https://search.fellesdatakatalog.digdir.no/dataservices";
const datasetsUrl = "https://search.fellesdatakatalog.digdir.no/datasets";

async function run() {
  const apis = await download(apisUrl, toApiEntry);
  await fs.writeFile("apis.json", JSON.stringify(apis), "utf8");
  const datasets = await download(datasetsUrl, toDatasetEntry);
  await fs.writeFile("datasets.json", JSON.stringify(datasets), "utf8");
}

run();

async function download(url, transform) {
  let total = -1;
  let page = 0;
  const size = 100;

  console.log("Downloading records...");
  const results = [];
  while (page * size < total || total === -1) {
    const json = await post(url, JSON.stringify({ page, size }), "application/json");
    const response = JSON.parse(json);
    total = response.page.totalElements;
    page++;

    results.push(...response.hits.map(transform).filter(Boolean));
    console.log(`Downloaded page ${page} of ${Math.ceil(total / size)}`);
  }
  console.log("Done!");
  return results;
}

function toLang(l) {
  return typeof l === "string" ? l : l ? l.nb || l.no || l.nn || l.en || "" : "";
}

function toPublisher(hit) {
  return (
    toLang(hit.publisher?.prefLabel) ||
    hit.publisher?.name ||
    toLang(hit.catalog?.publisher?.prefLabel) ||
    hit.catalog?.publisher?.name ||
    toLang(hit.catalog?.title) ||
    "Ukjent"
  );
}

function toApiDistribution(urls, desc) {
  return urls?.map((url, i) => ({
    description: "Beskrivelse",
    accessURL: [desc ? desc[i] : ""],
    downloadURL: [url],
    format: "API",
  }));
}

function toApiEntry(hit) {
  return {
    id: hit.id,
    entryUri: `https://data.norge.no/apis/${hit.id}`,
    uri: hit.uri,
    title: toLang(hit.title),
    description: toLang(hit.description),
    keyword: ["API"],
    antall: hit.endpointURL ? hit.endpointURL.length : 0,
    publisher: toPublisher(hit),
    distribution: toApiDistribution(hit.endpointURL, hit.endpointDescription),
  };
}

function toDatasetDistribution(d) {
  return {
    description: toLang(d.description),
    downloadURL: d.downloadURL,
    accessURL: d.accessURL,
    format: d.format ? (Array.isArray(d.format) ? d.format.map(mapFormat) : mapFormat(d.format)) : null,
  };
}

function toDatasetEntry(hit) {
  return {
    id: hit.id,
    entryUri: `https://data.norge.no/datasets/${hit.id}`,
    uri: hit.uri,
    title: toLang(hit.title),
    description: toLang(hit.description),
    keyword: (hit.keyword && hit.keyword.map(toLang)) || [],
    antall: hit.distribution ? hit.distribution.length : 0,
    publisher: toPublisher(hit),
    distribution: hit.distribution && hit.distribution.map(toDatasetDistribution),
  };
}

function mapFormat(format) {
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
