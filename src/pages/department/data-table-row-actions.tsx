import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
import { MoreHorizontal, SquarePen, Trash2, Copy, Eye } from "lucide-react";

interface WithId<T> {
  departmentId: number;
}

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData extends WithId<string>>({
  row,
}: DataTableRowActionsProps<TData>) {
  const navigate = useNavigate();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const departmentId = row.original.departmentId;

  const handleViewDetails = () => {
    setIsDropdownOpen(false);
    navigate(`/department/${departmentId}`);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdownOpen(false);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdownOpen(false);
    setIsDeleteOpen(true);
  };

  const handleCopyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdownOpen(false);
    navigator.clipboard.writeText(departmentId.toString());
  };

  const handleViewDetailsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleViewDetails();
  };

  return (
    <>
      {/* Edit Dialog */}
      <ResponsiveDialog
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title="Edit Department"
        className="sm:max-w-screen-md"
      >
        <div className="p-6">
          <DepartmentEditForm 
            departmentId={departmentId} 
            setIsOpen={setIsEditOpen} 
          />
        </div>
      </ResponsiveDialog>

      {/* Delete Dialog */}
      <DepartmentDeleteForm 
        departmentId={departmentId} 
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen} 
      />

      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="h-8 w-8 p-0 hover:bg-muted"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-[160px] z-50 bg-background border shadow-md"
          side="bottom"
          sideOffset={5}
        >
          <DropdownMenuItem 
            className="cursor-pointer focus:bg-muted hover:bg-muted"
            onClick={handleViewDetailsClick}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            className="cursor-pointer focus:bg-muted hover:bg-muted"
            onClick={handleEditClick}
          >
            <SquarePen className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="cursor-pointer focus:bg-muted hover:bg-muted"
            onClick={handleCopyClick}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy ID
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            className="cursor-pointer focus:bg-destructive/10 hover:bg-destructive/10 text-destructive focus:text-destructive"
            onClick={handleDeleteClick}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}