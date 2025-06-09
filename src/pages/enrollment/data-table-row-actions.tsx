// components/enrollment/data-table-row-actions.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal, Trash2, Copy, User, BookOpen } from "lucide-react";
import { Enrollment } from "@/types/enrollment";
import EnrollmentDeleteForm from "@/components/forms/enrollment-delete-form";
import { useToast } from "@/hooks/use-toast";

interface WithId<T> {
  enrollmentId: number;
}

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData extends Enrollment>({
  row,
}: DataTableRowActionsProps<TData>) {
  const enrollment = row.original as Enrollment;
  const { info } = useToast();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleCopyEnrollmentId = () => {
    navigator.clipboard.writeText(enrollment.enrollmentId.toString());
    info({
      title: "Copied!",
      description: `Enrollment ID ${enrollment.enrollmentId} copied to clipboard`,
      duration: 2000
    });
  };

  const handleCopyStudentId = () => {
    navigator.clipboard.writeText(enrollment.studentId.toString());
    info({
      title: "Copied!",
      description: `Student ID ${enrollment.studentId} copied to clipboard`,
      duration: 2000
    });
  };

  return (
    <>
      {/* Professional Delete Form */}
      <EnrollmentDeleteForm
        enrollmentId={enrollment.enrollmentId}
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
          <DropdownMenuContent align="end" className="w-[180px] z-50">
            <DropdownMenuItem className="group flex w-full items-center justify-between text-left p-0 text-sm font-base">
              <button
                onClick={handleCopyEnrollmentId}
                className="w-full justify-start flex rounded-md p-2 transition-all duration-75"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Enrollment ID
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem className="group flex w-full items-center justify-between text-left p-0 text-sm font-base">
              <button
                onClick={handleCopyStudentId}
                className="w-full justify-start flex rounded-md p-2 transition-all duration-75"
              >
                <User className="h-4 w-4 mr-2" />
                Copy Student ID
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem className="group flex w-full items-center justify-between text-left p-0 text-sm font-base">
              <button
                onClick={() => setIsDeleteOpen(true)}
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