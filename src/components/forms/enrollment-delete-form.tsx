// components/forms/enrollment-delete-form.tsx
import { useToast } from "@/hooks/use-toast";
import { useEnrollmentContext } from "@/contexts/enrollmentContext";
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

interface EnrollmentDeleteFormProps {
  enrollmentId: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

function EnrollmentDeleteForm({ 
  enrollmentId, 
  isOpen,
  setIsOpen 
}: EnrollmentDeleteFormProps) {
  const { success, error } = useToast(); // Using enhanced toast methods
  const { state, deleteEnrollment } = useEnrollmentContext();

  // Use the loading state from the context
  const isLoading = state.deleting;

  // Find the enrollment to get their details for confirmation
  const enrollment = state.enrollments.find(
    enrollment => enrollment.enrollmentId === enrollmentId
  );

  const handleDelete = async () => {
    try {
      await deleteEnrollment(enrollmentId);

      success({
        title: "Enrollment Deleted!",
        description: `${enrollment?.studentName || "Student"} has been removed from ${enrollment?.courseCode || "course"}`,
        duration: 4000
      });

      setIsOpen(false);
    } catch (err: unknown) {
      console.error("Error deleting enrollment:", err);
      error({
        title: "Delete Failed",
        description: err instanceof Error && 'response' in err 
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to delete enrollment"
          : "Failed to delete enrollment",
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
            Delete Enrollment
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>
                Are you sure you want to delete this enrollment? This action cannot be undone.
              </p>
              
              <div className="rounded-lg border p-3 bg-muted/50">
                <h4 className="font-medium text-sm">Enrollment Details:</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>Enrollment ID:</strong> {enrollmentId}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Student:</strong> {enrollment?.studentName || "Unknown"}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Student ID:</strong> {enrollment?.studentId || "N/A"}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Course:</strong> {enrollment?.courseName || "Unknown"}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Course Code:</strong> {enrollment?.courseCode || "N/A"}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Enrollment Date:</strong> {enrollment?.enrollmentDate ? new Date(enrollment.enrollmentDate).toLocaleDateString() : "N/A"}
                </p>
              </div>

              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-yellow-600 mb-2">⚠️ This may affect:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Student's access to course materials</li>
                  <li>Attendance records for this course</li>
                  <li>Academic progress tracking</li>
                  <li>Grade records and assessments</li>
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
              "Delete Enrollment"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default EnrollmentDeleteForm;