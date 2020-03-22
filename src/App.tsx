import React from "react";
import {
  useTable,
  usePagination,
  useFilters,
  useSortBy,
  useGlobalFilter
} from "react-table";
import {
  Dataset,
  Distribution,
  DatasetColumn,
  DatasetTableOptions,
  DatasetTableInstance
} from "./types";
import { anyOf } from "./utils/filters";
import useDataNorge from "./hooks/useDataNorge";
import SelectColumnFilter from "./components/SelectColumnFilter";
import Pagination from "./components/Pagination";
import Table from "./components/Table";
import Search from "./components/Search";
import "./App.scss";

const defaultColumn: DatasetColumn = {
  width: "10%",
  disableFilters: true
};

const columns: DatasetColumn[] = [
  {
    Header: "Forvalter",
    id: "publisher",
    accessor: "publisher.name",
    disableFilters: false,
    Filter: SelectColumnFilter,
    filter: "includes",
    width: "10%"
  },
  {
    Header: "Datasett",
    accessor: "title",
    width: "20%",
    Cell: ({ cell: { value, row } }) => (
      <a
        href={row.original.id}
        target="_blank"
        rel="noreferrer noopener"
        title={value}
      >
        {value}
      </a>
    )
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
    Filter: SelectColumnFilter,
    filter: anyOf,
    width: "1%"
  },
  {
    Header: "Formater",
    accessor: "distribution",
    Cell: ({ cell: { value } }) => (
      <div className="formats">
        {!value
          ? "-"
          : value.map((v: Distribution, i: number) => (
              <a href={v.accessURL} className="format" key={i}>
                {v.format || v.title}
              </a>
            ))}
      </div>
    ),
    width: "1%",
    disableGlobalFilter: true
  }
];

const sortBy = [{ id: "publisher" }, { id: "title" }];

const tableOptions: DatasetTableOptions = {
  defaultColumn,
  columns,
  defaultCanFilter: false,
  initialState: {
    pageSize: parseInt(localStorage.getItem("datanorge-pageSize") || "20"),
    sortBy
  },
  data: []
};

function App() {
  const data = useDataNorge();

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
