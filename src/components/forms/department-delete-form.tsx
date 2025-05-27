import { useToast } from "@/hooks/use-toast";
import { useDepartmentContext } from "@/contexts/departmentContext";
import { Loader2, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DepartmentDeleteFormProps {
  departmentId: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

function DepartmentDeleteForm({ 
  departmentId, 
  isOpen,
  setIsOpen 
}: DepartmentDeleteFormProps) {
  const { success, error } = useToast(); // Using enhanced toast methods
  const { state, deleteDepartment } = useDepartmentContext();

  // Use the loading state from the context
  const isLoading = state.loading;

  // Find the department to get its name for confirmation
  const department = state.departments.find(
    dept => dept.departmentId === departmentId
  );

  const handleDelete = async () => {
    try {
      await deleteDepartment(departmentId);

      success({
        title: "Success!",
        description: "Department deleted successfully",
        duration: 4000
      });

      setIsOpen(false);
    } catch (error: any) {
      console.error("Error deleting department:", error);
      error({
        title: "Delete Failed",
        description: error.response?.data?.message || "Failed to delete department",
        duration: 6000
      });
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Delete Department
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>
                Are you sure you want to delete this department? This action cannot be undone.
              </p>
              
              <div className="rounded-lg border p-3 bg-muted/50">
                <h4 className="font-medium text-sm">Department Details:</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>ID:</strong> {departmentId}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Name:</strong> {department?.departmentName || "Unknown"}
                </p>
              </div>

              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-yellow-600 mb-2">⚠️ This may affect:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Courses associated with this department</li>
                  <li>Lecturers assigned to this department</li>
                  <li>Student enrollments in related courses</li>
                  <li>Session schedules for department courses</li>
                </ul>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Department"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DepartmentDeleteForm;