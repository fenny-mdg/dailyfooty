import { useSearchParams } from "@remix-run/react";
import { Table } from "@tanstack/react-table";

import { cn } from "@/lib/utils.ts";
import { generatePagination } from "~/utils/misc.tsx";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination.tsx";

// eslint-disable-next-line no-empty-pattern
export default function DataTablePagination<TData>({
  table,
}: {
  table: Table<TData>;
}) {
  const {
    getCanNextPage,
    getCanPreviousPage,
    getPageCount,
    nextPage,
    previousPage,
    setPageIndex,
  } = table;
  const [params, setSearchParams] = useSearchParams();
  const pageCount = getPageCount();
  const canNextPage = getCanNextPage();
  const canPreviousPage = getCanPreviousPage();
  const page = parseInt(params.get("page") ?? "1");

  const handlePrevious = () => {
    params.set("page", (page - 1).toString());
    setSearchParams(params);
    previousPage();
  };
  const handleNext = () => {
    nextPage();
    params.set("page", (page + 1).toString());
    setSearchParams(params);
  };
  const handleGoToPage = (selectedPage: string) => {
    params.set("page", selectedPage);
    setSearchParams(params);
    const newPage = parseInt(selectedPage);
    setPageIndex(newPage - 1);
  };
  const paginationLabels = generatePagination({ pageCount, currentPage: page });

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={handlePrevious}
            className={cn({
              "cursor-pointer": canPreviousPage,
              "cursor-not-allowed": !canPreviousPage,
              "pointer-events-none": !canPreviousPage,
            })}
          />
        </PaginationItem>
        <div className="flex gap-2  flex-wrap 
        ">
          {paginationLabels.map((label, index) => (
            <PaginationItem key={`${label}${index}`} className="cursor-pointer">
              {label === "..." ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  onClick={() => handleGoToPage(label)}
                  isActive={`${page}` === label}
                >
                  {label}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
        </div>

        <PaginationItem>
          <PaginationNext
            onClick={handleNext}
            className={cn({
              "cursor-pointer": canNextPage,
              "cursor-not-allowed": !canNextPage,
              "pointer-events-none": !canNextPage,
            })}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
