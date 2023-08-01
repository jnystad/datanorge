import { useState } from "react";
import { Table as TableModel, flexRender } from "@tanstack/react-table";
import { Dataset } from "../types/Dataset";
import { DetailsDialog } from "./DetailsDialog";
import "./Table.scss";

function Table({ table }: { table: TableModel<Dataset> }) {
  let prevPublisher: string;
  const [showDetails, setShowDetails] = useState<Dataset>();

  return (
    <>
      <div className="table">
        <div className="tbody">
          {table.getRowModel().rows.map((row) => {
            const publisher = row.getValue("publisher") as string;
            const isNewPublisher = publisher !== prevPublisher;
            prevPublisher = publisher;

            return (
              <>
                {isNewPublisher && (
                  <div className="row publisher" key={row.id + "_publisher"}>
                    <span className="cell cell-publisher">{publisher}</span>
                  </div>
                )}
                <div className="row" key={row.id} onClick={() => setShowDetails(row.original)}>
                  {row.getVisibleCells().map(
                    (cell) =>
                      cell.column.id !== "publisher" && (
                        <span key={cell.id} className={"cell cell-" + cell.column.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </span>
                      )
                  )}
                </div>
              </>
            );
          })}
        </div>
      </div>
      {showDetails && <DetailsDialog entry={showDetails} onClose={() => setShowDetails(undefined)} />}
    </>
  );
}

export default Table;
