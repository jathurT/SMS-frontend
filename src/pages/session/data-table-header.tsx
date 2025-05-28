import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";
import { Table } from "@tanstack/react-table";
import { exportToExcel } from "@/lib/export-to-excel";
import { useState } from "react";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import SessionForm from "@/components/forms/session-form";
import { columnHeadersSession } from "@/constant/index";

interface DataTableHeaderProps<TData> {
  table: Table<TData>;
  courseId?: number;
}

export function DataTableHeader<TData>({
  table,
  courseId,
}: DataTableHeaderProps<TData>) {
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = () => {
    const dataToExport = table
      .getRowModel()
      .rows.map((row: any) => row.original);
    exportToExcel(
      dataToExport,
      "Sessions",
      columnHeadersSession,
      Array(columnHeadersSession.length).fill(20)
    );
  };

  return (
    <div className="flex justify-between py-5">
      <ResponsiveDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Add Session"
        className="sm:max-w-screen-md p-20"
      >
        <SessionForm setIsOpen={setIsOpen} courseId={courseId} />
      </ResponsiveDialog>
      <h1 className="text-2xl font-bold pl-1">Session List</h1>
      <div className="flex gap-2 md:gap-5">
        <Button
          className="btn btn-primary bg-muted"
          variant="ghost"
          onClick={handleExport}
        >
          <span className="hidden md:block">Export CSV</span>
          <Download className="md:hidden" />
        </Button>
        <Button 
          className="btn btn-primary p-o" 
          onClick={() => setIsOpen(true)}
          disabled={!courseId}
        >
          <span className="hidden md:block">Add Session</span>
          <Plus className="md:hidden" />
        </Button>
      </div>
    </div>
  );
}