import { useEffect } from "react";
import { Dataset } from "../types/Dataset";
import { Table } from "@tanstack/react-table";
import "./Pagination.scss";

interface PaginationProps {
  table: Table<Dataset>;
}

function Pagination({ table }: PaginationProps) {
  const {
    getCanNextPage,
    getCanPreviousPage,
    getPageCount,
    setPageIndex,
    nextPage,
    previousPage,
    setPageSize,
    getState,
  } = table;

  const { pageIndex, pageSize } = getState().pagination;

  useEffect(() => window.scrollTo(0, 0), [pageIndex]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.code === "ArrowLeft") {
        e.preventDefault();
        e.stopPropagation();
        getCanPreviousPage() && previousPage();
      }
      if (e.altKey && e.code === "ArrowRight") {
        e.preventDefault();
        e.stopPropagation();
        getCanNextPage() && nextPage();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [previousPage, nextPage, getCanPreviousPage, getCanNextPage]);

  useEffect(() => {
    localStorage.setItem("datanorge-pageSize", String(pageSize));
  }, [pageSize]);

  return (
    <div className="pagination">
      <div className="pagination--buttons">
        <button onClick={() => setPageIndex(0)} disabled={!getCanPreviousPage()}>
          <svg viewBox="0 0 14 14">
            <path d="M13,3l-6,5l6,5M7,3l-6,5l6,5" fill="none" strokeWidth={2} stroke="currentColor" />
          </svg>
        </button>
        <button onClick={previousPage} disabled={!getCanPreviousPage()}>
          <svg viewBox="0 0 14 14">
            <path d="M9,3l-6,5l6,5" fill="none" strokeWidth={2} stroke="currentColor" />
          </svg>
        </button>
        <span>
          Side {pageIndex + 1} av {getPageCount()}
        </span>
        <button onClick={nextPage} disabled={!getCanNextPage()}>
          <svg viewBox="0 0 14 14">
            <path d="M5,3l6,5l-6,5" fill="none" strokeWidth={2} stroke="currentColor" />
          </svg>
        </button>
        <button onClick={() => setPageIndex(getPageCount() - 1)} disabled={!getCanNextPage()}>
          <svg viewBox="0 0 14 14">
            <path d="M1,3l6,5l-6,5M7,3l6,5l-6,5" fill="none" strokeWidth={2} stroke="currentColor" />
          </svg>
        </button>
      </div>
      <select style={{ width: "140px" }} value={pageSize} onChange={(e) => setPageSize(parseInt(e.target.value))}>
        <option value="20">20 per side</option>
        <option value="50">50 per side</option>
        <option value="100">100 per side</option>
        <option value="10000">Alt på en side</option>
      </select>
    </div>
  );
}

export default Pagination;
