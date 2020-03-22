import { Row } from "react-table";

export function anyOf<T extends {}>(
  rows: Row<T>[],
  ids: string[],
  filterValue: string
) {
  if (filterValue === "") return rows;
  return rows.filter(row =>
    ids.some(id => row.values[id].some((v: string) => filterValue === v))
  );
}
