import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";
import { Table } from "@tanstack/react-table";
import { exportToExcel } from "@/lib/export-to-excel";
import { useState } from "react";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import CourseForm from "@/components/forms/course-form";
import { columnHeadersCourse } from "@/constant/index";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableHeader<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = () => {
    const dataToExport = table
      .getRowModel()
      .rows.map((row: any) => row.original);
    exportToExcel(
      dataToExport,
      "Course",
      columnHeadersCourse,
      Array(columnHeadersCourse.length).fill(20)
    );
  };

  return (
    <div className="flex justify-between py-5">
      <ResponsiveDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Add Course"
        className="sm:max-w-screen-md p-20"
      >
        <CourseForm setIsOpen={setIsOpen} />
      </ResponsiveDialog>
      <h1 className="text-2xl font-bold pl-1">Course List</h1>
      <div className="flex gap-2 md:gap-5">
        <Button
          className="btn btn-primary bg-muted"
          variant="ghost"
          onClick={handleExport}
        >
          <span className="hidden md:block">Export CSV</span>
          <Download className="md:hidden" />
        </Button>
        <Button className="btn btn-primary p-o" onClick={() => setIsOpen(true)}>
          <span className="hidden md:block">Add Course</span>
          <Plus className="md:hidden" />
        </Button>
      </div>
    </div>
  );
}