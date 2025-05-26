import { useState } from "react";

import DepartmentDeleteForm from "@/components/forms/department-delete-form";
import DepartmentEditForm from "@/components/forms/department-edit-form";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal, SquarePen, Trash2, Copy } from "lucide-react";

interface WithId<T> {
  departmentId: number;
}

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData extends WithId<string>>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const departmentId = row.original.departmentId;

  return (
    <>
      <ResponsiveDialog
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title="Edit Department"
        className="sm:max-w-screen-md p-20"
      >
        <DepartmentEditForm departmentId={departmentId} setIsOpen={setIsEditOpen} />
      </ResponsiveDialog>
      <DepartmentDeleteForm 
        departmentId={departmentId} 
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen} 
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px] z-50">
          <DropdownMenuItem className="group flex w-full items-center justify-between text-left p-0 text-sm font-base">
            <button
              onClick={() => {
                setIsEditOpen(true);
              }}
              className="w-full justify-start flex rounded-md p-2 transition-all duration-75"
            >
              <SquarePen className="h-4 w-4 mr-2" />
              Edit
            </button>
          </DropdownMenuItem>
          <DropdownMenuItem className="group flex w-full items-center justify-between text-left p-0 text-sm font-base">
            <button
              onClick={() =>
                navigator.clipboard.writeText(departmentId.toString())
              }
              className="w-full justify-start flex rounded-md p-2 transition-all duration-75"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy ID
            </button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="group flex w-full items-center justify-between text-left p-0 text-sm font-base">
            <button
              onClick={() => {
                setIsDeleteOpen(true);
              }}
              className="w-full justify-start flex text-red-500 rounded-md p-2 transition-all duration-75"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}