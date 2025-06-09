import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Enrollment } from "@/types/enrollment";

export const columns: ColumnDef<Enrollment>[] = [
  {
    accessorKey: "enrollmentId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Enrollment ID" />
    ),
    cell: ({ row }) => (
      <div className="w-[100px] font-medium">{row.getValue("enrollmentId")}</div>
    ),
  },
  {
    accessorKey: "studentId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student ID" />
    ),
    cell: ({ row }) => (
      <div className="w-[100px] font-medium">{row.getValue("studentId")}</div>
    ),
  },
  {
    accessorKey: "studentName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student Name" />
    ),
    cell: ({ row }) => (
      <div className="w-[200px] capitalize font-medium">
        {row.getValue("studentName")}
      </div>
    ),
  },
  {
    accessorKey: "courseCode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Course Code" />
    ),
    cell: ({ row }) => (
      <div className="w-[120px] font-medium">
        {row.getValue("courseCode")}
      </div>
    ),
  },
  {
    accessorKey: "courseName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Course Name" />
    ),
    cell: ({ row }) => (
      <div className="w-[250px] font-medium">
        {row.getValue("courseName")}
      </div>
    ),
  },
  {
    accessorKey: "enrollmentDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Enrollment Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("enrollmentDate") as string;
      return (
        <div className="w-[120px] font-medium">
          {date ? new Date(date).toLocaleDateString() : "N/A"}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];