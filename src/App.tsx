import { useMemo } from "react";
import {
  useTable,
  usePagination,
  useFilters,
  useSortBy,
  useGlobalFilter,
  Renderer,
  FilterProps,
} from "react-table";
import {
  Dataset,
  DatasetColumn,
  DatasetTableOptions,
  DatasetTableInstance,
} from "./types";
import { anyOf } from "./utils/filters";
import useDatasets from "./hooks/useDatasets";
import SelectColumnFilter from "./components/SelectColumnFilter";
import Pagination from "./components/Pagination";
import Table from "./components/Table";
import Search from "./components/Search";
import Loading from "./components/Loading";
import "./App.scss";
import useApis from "./hooks/useApis";
import Formats from "./components/Formats";

const defaultColumn: DatasetColumn = {
  accessor: "id",
  width: "10%",
  disableFilters: true,
};

const columns: DatasetColumn[] = [
  {
    Header: "Forvalter",
    id: "publisher",
    accessor: (row) => row.publisher.name,
    disableFilters: false,
    Filter: SelectColumnFilter as unknown as Renderer<FilterProps<Dataset>>,
    filter: "includes",
    width: "10%",
  },
  {
    Header: "Datasett",
    accessor: "title",
    width: "20%",
    Cell: ({ cell: { value, row } }) => (
      <a
        href={row.original.entryUri}
        target="_blank"
        rel="noreferrer noopener"
        title={value}
      >
        {value}
      </a>
    ),
  },
  {
    Header: "",
    accessor: "description",
    Cell: ({ cell: { value } }) => (
      <span title={value}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    ),
  },
  {
    Header: "Kategorier",
    accessor: "keyword",
    Cell: ({ cell: { value } }) => (
      <div className="tags" title={value.join(" | ")}>
        {!value
          ? "-"
          : value.map((v: string, i: number) => (
              <span className="tag" key={i}>
                {v}
              </span>
            ))}
      </div>
    ),
    disableFilters: false,
    Filter: SelectColumnFilter as unknown as Renderer<FilterProps<Dataset>>,
    filter: anyOf,
    width: "1%",
  },
  {
    Header: "",
    accessor: "distribution",
    Cell: ({ cell: { value, row } }) => (
      <div className="formats">
        {!value ? "-" : <Formats formats={value} entry={row.original} />}
      </div>
    ),
    width: "1%",
    disableGlobalFilter: true,
  },
];

const sortBy = [{ id: "publisher" }, { id: "title" }];

const tableOptions: DatasetTableOptions = {
  defaultColumn,
  columns,
  defaultCanFilter: false,
  initialState: {
    pageSize: parseInt(localStorage.getItem("datanorge-pageSize") || "20"),
    sortBy,
  },
  data: [],
  autoResetGlobalFilter: false,
  autoResetFilters: false,
};

function App() {
  const { datasets, loading: datasetsLoading } = useDatasets();
  const { apis, loading: apisLoading } = useApis();

  const loading = apisLoading || datasetsLoading;

  const data = useMemo(() => [...datasets, ...apis], [datasets, apis]);

  const table = useTable<Dataset>(
    { ...tableOptions, data },
    useGlobalFilter,
    useFilters,
    useSortBy,
    usePagination
  ) as DatasetTableInstance;

  return (
    <div className="App">
      <header>
        <h1>Register over åpne datasett i Norge</h1>
        <Search table={table} />
      </header>
      <p style={{ maxWidth: "1200px" }}>
        Dette er en forenklet og kompakt oversikt over datasett og APIer
        publisert av offentlige organer og andre norske organisasjoner.
        Informasjonen er hentet fra data.norge.no, og dette er en alternativ
        måte å søke etter publiserte data. Bruk søket i hjørnet for å søke på
        forvalter, tittel, beskrivelse og nøkkelord, eller filtrer nedenfor.
      </p>
      <Pagination table={table} />
      <Table table={table} />
      <Pagination table={table} />
      <footer>
        <p>
          Data hentet fra{" "}
          <a href="https://data.norge.no/">Digitaliseringsdirektoratet</a>.
        </p>
        <p>
          Utviklet av Jørgen Nystad.{" "}
          <a href="https://github.com/jnystad/datanorge">GitHub</a>
        </p>
      </footer>
      {loading && <Loading />}
    </div>
  );
}

export default App;
