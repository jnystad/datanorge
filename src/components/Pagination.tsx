import React, { SFC, useEffect } from "react";
import { UsePaginationInstanceProps, UsePaginationState } from "react-table";
import { Dataset } from "../types";
import "./Pagination.scss";

interface PaginationProps {
  table: UsePaginationInstanceProps<Dataset> & {
    state: UsePaginationState<Dataset>;
  };
}

const Pagination: SFC<PaginationProps> = ({ table }) => {
  const {
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = table;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.code === "ArrowLeft") {
        e.preventDefault();
        e.stopPropagation();
        canPreviousPage && previousPage();
      }
      if (e.ctrlKey && e.code === "ArrowRight") {
        e.preventDefault();
        e.stopPropagation();
        canNextPage && nextPage();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [canPreviousPage, previousPage, canNextPage, nextPage]);

  useEffect(() => {
    localStorage.setItem("datanorge-pageSize", String(pageSize));
  }, [pageSize]);

  return (
    <div className="pagination">
      <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
        <svg viewBox="0 0 14 14">
          <path
            d="M13,3l-6,5l6,5M7,3l-6,5l6,5"
            fill="none"
            strokeWidth={2}
            stroke="currentColor"
          />
        </svg>
      </button>
      <button onClick={previousPage} disabled={!canPreviousPage}>
        <svg viewBox="0 0 14 14">
          <path
            d="M9,3l-6,5l6,5"
            fill="none"
            strokeWidth={2}
            stroke="currentColor"
          />
        </svg>
      </button>
      <span>
        Side {pageIndex + 1} av {pageCount}
      </span>
      <button onClick={nextPage} disabled={!canNextPage}>
        <svg viewBox="0 0 14 14">
          <path
            d="M5,3l6,5l-6,5"
            fill="none"
            strokeWidth={2}
            stroke="currentColor"
          />
        </svg>
      </button>
      <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
        <svg viewBox="0 0 14 14">
          <path
            d="M1,3l6,5l-6,5M7,3l6,5l-6,5"
            fill="none"
            strokeWidth={2}
            stroke="currentColor"
          />
        </svg>
      </button>
      <br />
      <select
        style={{ width: "250px" }}
        value={pageSize}
        onChange={e => setPageSize(parseInt(e.target.value))}
      >
        <option value="20">20 per side</option>
        <option value="50">50 per side</option>
        <option value="100">100 per side</option>
        <option value="10000">Alt på en side</option>
      </select>
    </div>
  );
};

export default Pagination;
