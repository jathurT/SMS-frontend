import { useToast } from "@/hooks/use-toast";
import { useLecturerContext } from "@/contexts/lecturerContext";
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

interface LecturerDeleteFormProps {
  lecturerId: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

function LecturerDeleteForm({ 
  lecturerId, 
  isOpen,
  setIsOpen 
}: LecturerDeleteFormProps) {
  const { success, error } = useToast(); // Using enhanced toast methods
  const { state, deleteLecturer } = useLecturerContext();

  // Use the loading state from the context
  const isLoading = state.loading;

  // Find the lecturer to get their details for confirmation
  const lecturer = state.lecturers.find(
    lect => lect.lecturerId === lecturerId
  );

  const handleDelete = async () => {
    try {
      await deleteLecturer(lecturerId);

      success({
        title: "Success!",
        description: "Lecturer deleted successfully",
        duration: 4000
      });

      setIsOpen(false);
    } catch (err: unknown) {
      console.error("Error deleting lecturer:", err);
      error({
        title: "Delete Failed",
        description: (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to delete lecturer",
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
            Delete Lecturer
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>
                Are you sure you want to delete this lecturer? This action cannot be undone.
              </p>
              
              <div className="rounded-lg border p-3 bg-muted/50">
                <h4 className="font-medium text-sm">Lecturer Details:</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>ID:</strong> {lecturerId}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Name:</strong> {lecturer ? `${lecturer.firstName} ${lecturer.lastName}` : "Unknown"}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Email:</strong> {lecturer?.email || "Unknown"}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Department ID:</strong> {lecturer?.departmentId || "Unknown"}
                </p>
              </div>

              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-yellow-600 mb-2">⚠️ This may affect:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Courses taught by this lecturer</li>
                  <li>Scheduled sessions conducted by this lecturer</li>
                  <li>Course assignments and teaching schedules</li>
                  <li>Student attendance records for their sessions</li>
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
              "Delete Lecturer"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default LecturerDeleteForm;