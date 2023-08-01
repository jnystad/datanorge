import { useState } from "react";
import { createColumnHelper, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { IconExternalLink, IconLink } from "@tabler/icons-react";
import { Dataset } from "./types/Dataset";
import useDatasets from "./hooks/useDatasets";
import Pagination from "./components/Pagination";
import Table from "./components/Table";
import Search from "./components/Search";
import Loading from "./components/Loading";
import "./App.scss";

const columnHelper = createColumnHelper<Dataset>();
const columns = [
  columnHelper.accessor("publisher", {
    id: "publisher",
    header: "Forvalter",
    enableColumnFilter: true,
    size: 10,
  }),
  columnHelper.accessor("title", {
    header: "",
    size: 20,
    cell: ({ row, getValue }) => (
      <>
        <span>{getValue()}</span>
        <a href={row.original.entryUri} target="_blank" rel="noreferrer noopener" onClick={(e) => e.stopPropagation()}>
          data.norge.no <IconExternalLink />
        </a>
      </>
    ),
  }),
  columnHelper.accessor("description", {
    header: "",
    cell: ({ getValue }) => (
      <span title={getValue()}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    ),
  }),
  columnHelper.accessor("keyword", {
    header: "Kategorier",
    cell: ({ getValue }) => {
      const value = getValue();
      return (
        <div className="tags" title={value.join(" | ")}>
          {!value
            ? "-"
            : value.map((v: string, i: number) => (
                <span className="tag" key={i}>
                  {v}
                </span>
              ))}
        </div>
      );
    },
    size: 1,
  }),
  columnHelper.accessor("distribution", {
    header: "",
    cell: ({ getValue }) => {
      const value = getValue();
      return (
        <>
          <IconLink /> {value?.length || 0}
        </>
      );
    },
    size: 1,
  }),
];

const initialPagination = {
  pageIndex: 0,
  pageSize: parseInt(localStorage.getItem("datanorge-pageSize") || "20"),
};

function App() {
  const [pagination, setPagination] = useState(initialPagination);
  const [query, setQuery] = useState("");
  const [publisher, setPublisher] = useState("");
  const { datasets, aggregations, total, loading } = useDatasets(
    pagination.pageSize,
    pagination.pageIndex * pagination.pageSize,
    query,
    publisher
  );

  const table = useReactTable({
    columns,
    data: datasets,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      pagination,
    },
    manualPagination: true,
    pageCount: Math.ceil(total / pagination.pageSize),
    onPaginationChange: setPagination,
  });

  return (
    <div className="App">
      <h1>Register over åpne datasett i Norge</h1>
      <p style={{ maxWidth: "1200px" }}>
        Dette er en forenklet og kompakt oversikt over datasett og APIer publisert av offentlige organer og andre norske
        organisasjoner. Informasjonen er hentet fra data.norge.no, og dette er en alternativ måte å søke etter
        publiserte data.
      </p>
      <Search onChange={setQuery} />
      <div className="filters">
        <div className="filter">
          <label htmlFor="publisher">Forvalter</label>
          <select
            id="publisher"
            onChange={(e) => {
              setPublisher(e.target.value);
              table.setPageIndex(0);
            }}
          >
            <option value="">
              Alle {query ? "søketreff" : ""} ({total})
            </option>
            {aggregations.publishers.map((publisher, i) => (
              <option key={i} value={publisher.name}>
                {publisher.name} ({publisher.count})
              </option>
            ))}
          </select>
        </div>
      </div>
      <Table table={table} />
      <Pagination table={table} />
      <footer>
        <p>
          Data hentet fra <a href="https://data.norge.no/">Digitaliseringsdirektoratet</a>.
        </p>
        <p>
          Utviklet av Jørgen Nystad. <a href="https://github.com/jnystad/datanorge">GitHub</a>
        </p>
      </footer>
      {loading && <Loading />}
    </div>
  );
}

export default App;
