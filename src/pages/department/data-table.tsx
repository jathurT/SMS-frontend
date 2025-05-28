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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

interface WithDepartmentId {
  departmentId: number;
}

export function DataTable<TData extends WithDepartmentId, TValue>({
  columns,
  data,
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

  const handleRowClick = (row: TData, event: React.MouseEvent) => {
    // Prevent navigation if clicking on interactive elements
    const target = event.target as HTMLElement;
    const interactiveElements = [
      'button',
      'a', 
      '[role="button"]',
      '[data-actions-cell]',
      '.dropdown-trigger',
      '[data-radix-collection-item]'
    ];
    
    // Check if the clicked element or any of its parents is interactive
    for (const selector of interactiveElements) {
      if (target.closest(selector)) {
        return;
      }
    }

    navigate(`/department/${row.departmentId}`);
  };

  return (
    <div className="space-y-4 flex w-full flex-col">
      <DataTableHeader table={table} />
      <DataTableToolbar table={table} />
      <div className="overflow-y-auto rounded-md border border-border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow 
                key={headerGroup.id}
                className="border-b border-border hover:bg-muted/50"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    className="px-4 py-2 text-muted-foreground font-medium"
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
                  className="cursor-pointer hover:bg-muted/50 transition-colors border-b border-border data-[state=selected]:bg-muted"
                  onClick={(e) => handleRowClick(row.original, e)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell 
                      className="px-4 py-2 text-foreground" 
                      key={cell.id}
                      {...(cell.column.id === 'actions' ? { 'data-actions-cell': 'true' } : {})}
                    >
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
                  className="h-24 text-center text-muted-foreground"
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