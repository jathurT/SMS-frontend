import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Department } from "@/types/department";

export const columns: ColumnDef<Department>[] = [
  {
    accessorKey: "departmentId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Department ID" />
    ),
    cell: ({ row }) => (
      <div className="w-[100px] font-medium">{row.getValue("departmentId")}</div>
    ),
  },
  {
    accessorKey: "departmentName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Department Name" />
    ),
    cell: ({ row }) => (
      <div className="w-[200px] capitalize font-medium">
        {row.getValue("departmentName")}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];