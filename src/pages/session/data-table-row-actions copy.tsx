import { useState } from "react";
import { useNavigate } from "react-router-dom";

import LecturerDeleteForm from "@/components/forms/lecturer-delete-form";
import LecturerEditForm from "@/components/forms/lecturer-edit-form";
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
import { MoreHorizontal, SquarePen, Trash2, Copy, Eye } from "lucide-react";

interface WithId<T> {
  lecturerId: number;
}

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData extends WithId<string>>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const lecturerId = row.original.lecturerId;
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/lecturer/${lecturerId}`);
  };

  return (
    <>
      <ResponsiveDialog
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title="Edit Lecturer"
        className="sm:max-w-screen-md p-20"
      >
        <LecturerEditForm lecturerId={lecturerId} setIsOpen={setIsEditOpen} />
      </ResponsiveDialog>
      <LecturerDeleteForm
        lecturerId={lecturerId}
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
      />

      <div data-action-button onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="h-8 w-8 p-0"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px] z-50">
          <DropdownMenuItem className="group flex w-full items-center justify-between text-left p-0 text-sm font-base">
            <button
              onClick={handleViewDetails}
              className="w-full justify-start flex rounded-md p-2 transition-all duration-75"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
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
                navigator.clipboard.writeText(lecturerId.toString())
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
      </div>
    </>
  );
}

// Export the handleViewDetails function to be used by the parent component
export const useRowNavigation = (lecturerId: number) => {
  const navigate = useNavigate();
  
  return () => {
    navigate(`/lecturer/${lecturerId}`);
  };
};