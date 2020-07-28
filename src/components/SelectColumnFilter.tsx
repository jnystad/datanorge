import React, { SFC, useMemo } from "react";
import { Row, UseFiltersColumnProps, UseTableColumnProps } from "react-table";
import { Dataset } from "../types";

function addOption(options: any, option: string) {
  if (option in options) {
    options[option]++;
  } else {
    options[option] = 1;
  }
}

const SelectColumnFilter: SFC<{
  column: UseFiltersColumnProps<Dataset> & UseTableColumnProps<Dataset>;
}> = ({ column: { filterValue, setFilter, preFilteredRows, id } }) => {
  const options = useMemo(() => {
    const options: { [key: string]: number } = {};
    preFilteredRows.forEach((row: Row<Dataset>) => {
      Array.isArray(row.values[id])
        ? row.values[id].forEach((v: string) => addOption(options, v))
        : addOption(options, row.values[id]);
    });
    return options;
  }, [id, preFilteredRows]);

  const keys = useMemo(() => {
    const keys = Object.keys(options);
    keys.sort((a, b) =>
      options[b] === options[a] ? a.localeCompare(b) : options[b] - options[a]
    );
    return keys;
  }, [options]);

  return (
    <select
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">Alle ({preFilteredRows.length})</option>
      {keys.map((option, i) => (
        <option key={i} value={option}>
          {option} ({options[option]})
        </option>
      ))}
    </select>
  );
};

export default SelectColumnFilter;
