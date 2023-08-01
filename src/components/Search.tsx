import { useRef, useEffect, useState } from "react";

function Search({ onChange }: { onChange: (value: string) => void }) {
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
      onChange("");
      return;
    }
    const tId = setTimeout(() => onChange(query), 500);
    return () => clearTimeout(tId);
  }, [onChange, query]);

  return (
    <input
      ref={ref}
      type="search"
      name="search"
      placeholder="Søk på nøkkelord, tema, forvalter, osv."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      autoFocus
    />
  );
}

export default Search;
