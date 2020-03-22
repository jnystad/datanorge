import React, { SFC, useMemo } from "react";
import { Row, UseFiltersColumnProps, UseTableColumnProps } from "react-table";
import { Dataset } from "../types";

const SelectColumnFilter: SFC<{
  column: UseFiltersColumnProps<Dataset> & UseTableColumnProps<Dataset>;
}> = ({ column: { filterValue, setFilter, preFilteredRows, id } }) => {
  const options = useMemo(() => {
    const options = new Set<string>();
    preFilteredRows.forEach((row: Row<Dataset>) => {
      Array.isArray(row.values[id])
        ? row.values[id].forEach((v: string) => options.add(v))
        : options.add(row.values[id]);
    });
    return Array.from(options).sort();
  }, [id, preFilteredRows]);

  return (
    <select
      value={filterValue}
      onChange={e => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">Alle</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default SelectColumnFilter;
