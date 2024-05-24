import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";

import DataTablePagination from "./data-table-pagination.tsx";
import { DataTableProps } from "./data-table.tsx";

export default function DataCardList<TData, TValue>({
  columns,
  data,
  totalCount,
  paginationOptions,
  className,
}: DataTableProps<TData, TValue> & { className?: string }) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: paginationOptions?.pageIndex
      ? paginationOptions?.pageIndex - 1
      : 0,
    pageSize: paginationOptions?.pageSize ?? 10,
  });

  const table = useReactTable({
    data,
    rowCount: totalCount,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    state: {
      pagination,
    },
  });

  useEffect(() => {
    setPagination({
      pageIndex: paginationOptions?.pageIndex
        ? paginationOptions?.pageIndex - 1
        : 0,
      pageSize: paginationOptions?.pageSize ?? 10,
    });
  }, [paginationOptions]);

  return (
    <div className={className}>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map(
          (row) =>
            // <div key={row.id}>
            row
              .getVisibleCells()
              .map((cell) =>
                flexRender(cell.column.columnDef.cell, cell.getContext()),
              ),
          // </div>
        )
      ) : (
        <div>
          <div className="h-24 text-center">No results.</div>
        </div>
      )}
      {totalCount ? (
        <div className="flex items-center justify-end space-x-2 py-4">
          <DataTablePagination table={table} />
        </div>
      ) : null}
    </div>
  );
}
