import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Session } from "@/types/session";

export const columns: ColumnDef<Session>[] = [
  {
    accessorKey: "sessionId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Session ID" />
    ),
    cell: ({ row }) => (
      <div className="w-[100px] font-medium">{row.getValue("sessionId")}</div>
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
    accessorKey: "lecturerName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Lecturer" />
    ),
    cell: ({ row }) => (
      <div className="w-[180px] font-medium">
        {row.getValue("lecturerName")}
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("date") as string;
      return (
        <div className="w-[120px] font-medium">
          {date ? new Date(date).toLocaleDateString() : "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "startTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start Time" />
    ),
    cell: ({ row }) => {
      const time = row.getValue("startTime") as string;
      return (
        <div className="w-[100px] font-medium">
          {time ? new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }) : "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "endTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="End Time" />
    ),
    cell: ({ row }) => {
      const time = row.getValue("endTime") as string;
      return (
        <div className="w-[100px] font-medium">
          {time ? new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }) : "N/A"}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];