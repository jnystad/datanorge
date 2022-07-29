import { useRef, useEffect, FC, useState } from "react";
import { DatasetTableInstance } from "../types";

const Search: FC<{ table: DatasetTableInstance }> = ({ table }) => {
  const {
    state: { globalFilter },
    setGlobalFilter,
  } = table;

  const ref = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");

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

  useEffect(() => {
    if (!query) {
      setGlobalFilter("");
      return;
    }
    const tId = setTimeout(() => setGlobalFilter(query), 500);
    return () => clearTimeout(tId);
  }, [setGlobalFilter, query]);

  return (
    <input
      ref={ref}
      type="text"
      name="search"
      placeholder="Søk (ctrl+s)"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
};

export default Search;
