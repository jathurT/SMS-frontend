import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import PaginationArea from "./data-table-pagination-area";
import { DataTableToolbar } from "./data-table-toolbar";
import { DataTableHeader } from "./data-table-header";

interface LecturerData {
  lecturerId: number;
  // Add other properties as needed
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  // Add optional prop to control clickable behavior
  enableRowClick?: boolean;
  // Optional prop to customize the route path
  detailsRoutePath?: string;
}

export function DataTable<TData extends LecturerData, TValue>({
  columns,
  data,
  enableRowClick = true,
  detailsRoutePath = "/lecturer",
}: DataTableProps<TData, TValue>) {
  const navigate = useNavigate();
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const handleRowClick = (lecturerId: number, event: React.MouseEvent) => {
    if (!enableRowClick) return;
    
    // Prevent row click if user clicked on interactive elements
    const target = event.target as HTMLElement;
    const isInteractiveElement = target.closest(
      'button, [role="button"], [data-action-button], input, [type="checkbox"], a, select, textarea'
    );
    
    if (!isInteractiveElement) {
      navigate(`${detailsRoutePath}/${lecturerId}`);
    }
  };

  return (
    <div className="space-y-4 flex w-full flex-col ">
      <DataTableHeader table={table} />
      <DataTableToolbar table={table} />
      <div className="overflow-y-auto rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    className="px-4 py-2"
                    key={header.id}
                    colSpan={header.colSpan}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={(e) => handleRowClick(row.original.lecturerId, e)}
                  className={enableRowClick ? "cursor-pointer hover:bg-muted/50 transition-colors" : ""}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="px-4 py-2" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <PaginationArea table={table} />
    </div>
  );
}