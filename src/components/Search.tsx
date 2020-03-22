import React, { SFC, useRef, useEffect } from "react";
import { DatasetTableInstance } from "../types";

const Search: SFC<{ table: DatasetTableInstance }> = ({ table }) => {
  const {
    state: { globalFilter },
    setGlobalFilter
  } = table;

  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        e.stopPropagation();
        ref.current && ref.current.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [ref]);

  return (
    <input
      ref={ref}
      type="text"
      name="search"
      placeholder="Søk (ctrl+s)"
      value={globalFilter}
      onChange={e => setGlobalFilter(e.target.value)}
    />
  );
};

export default Search;
