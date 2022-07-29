import { FC } from "react";
import { DatasetTableInstance } from "../types";
import "./Table.scss";

const Table: FC<{ table: DatasetTableInstance }> = ({ table }) => {
  const { getTableBodyProps, getTableProps, page, headerGroups, prepareRow } =
    table;

  let prevPublisher: string;

  return (
    <div className="table" {...getTableProps()}>
      <div className="thead">
        {headerGroups.map((headerGroup, i) => (
          <div className="row" key={i}>
            {headerGroup.headers.map((column: any) => (
              <span
                className={"header header-" + column.id}
                {...column.getHeaderProps()}
              >
                {column.render("Header")}
                <div className="filter">
                  {column.canFilter ? column.render("Filter") : null}
                </div>
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className="tbody" {...getTableBodyProps()}>
        {page.map((row) => {
          prepareRow(row);

          const isNewPublisher = row.values.publisher !== prevPublisher;
          prevPublisher = row.values.publisher;

          return (
            <div className="row" {...row.getRowProps()}>
              {row.cells.map(
                (cell) =>
                  (cell.column.id !== "publisher" || isNewPublisher) && (
                    <span
                      className={"cell cell-" + cell.column.id}
                      {...cell.getCellProps()}
                    >
                      {cell.render("Cell")}
                    </span>
                  )
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Table;
