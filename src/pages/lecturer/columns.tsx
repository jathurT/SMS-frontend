import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Lecturer } from "@/types/lecturer";

export const columns: ColumnDef<Lecturer>[] = [
  {
    accessorKey: "lecturerId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Lecturer ID" />
    ),
    cell: ({ row }) => (
      <div className="w-[100px] font-medium">{row.getValue("lecturerId")}</div>
    ),
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First Name" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px] capitalize font-medium">
        {row.getValue("firstName")}
      </div>
    ),
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Name" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px] capitalize font-medium">
        {row.getValue("lastName")}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="w-[200px] font-medium">
        {row.getValue("email")}
      </div>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone Number" />
    ),
    cell: ({ row }) => (
      <div className="w-[120px] font-medium">
        {row.getValue("phoneNumber") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    cell: ({ row }) => (
      <div className="w-[200px] font-medium">
        {row.getValue("address") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "dateOfBirth",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date of Birth" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("dateOfBirth") as Date;
      return (
        <div className="w-[120px] font-medium">
          {date ? new Date(date).toLocaleDateString() : "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "departmentName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Department Name" />
    ),
    cell: ({ row }) => (
      <div className="w-[120px] font-medium">
        {row.getValue("departmentName")}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];