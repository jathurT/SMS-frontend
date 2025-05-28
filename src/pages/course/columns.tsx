import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Course } from "@/types/course";

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "courseId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Course ID" />
    ),
    cell: ({ row }) => (
      <div className="w-[100px] font-medium">{row.getValue("courseId")}</div>
    ),
  },
  {
    accessorKey: "courseName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Course Name" />
    ),
    cell: ({ row }) => (
      <div className="w-[200px] font-medium">
        {row.getValue("courseName")}
      </div>
    ),
  },
  {
    accessorKey: "courseCode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Course Code" />
    ),
    cell: ({ row }) => (
      <div className="w-[120px] font-medium uppercase">
        {row.getValue("courseCode")}
      </div>
    ),
  },
  {
    accessorKey: "credits",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Credits" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px] font-medium text-center">
        {row.getValue("credits")}
      </div>
    ),
  },
  {
    accessorKey: "semester",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Semester" />
    ),
    cell: ({ row }) => (
      <div className="w-[100px] font-medium">
        {row.getValue("semester")}
      </div>
    ),
  },
  {
    accessorKey: "departmentName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Department" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px] font-medium">
        {row.getValue("departmentName")}
      </div>
    ),
  },
  {
    accessorKey: "enrollmentKey",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Enrollement Key" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px] font-medium text-center">
        {row.getValue("enrollmentKey") || "0"}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
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