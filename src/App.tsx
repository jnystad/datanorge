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
    Header: "Formater",
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
        {loading && <Loading />}
        <Search table={table} />
      </header>
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
    </div>
  );
}

export default App;
