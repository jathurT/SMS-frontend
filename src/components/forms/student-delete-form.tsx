import { useToast } from "@/hooks/use-toast";
import { useStudentContext } from "@/contexts/studentContext";
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

interface StudentDeleteFormProps {
  studentId: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

function StudentDeleteForm({ 
  studentId, 
  isOpen,
  setIsOpen 
}: StudentDeleteFormProps) {
  const { success, error } = useToast(); // Using enhanced toast methods
  const { state, deleteStudent } = useStudentContext();

  // Use the loading state from the context
  const isLoading = state.loading;

  // Find the student to get their details for confirmation
  const student = state.students.find(
    stud => stud.studentId === studentId
  );

  const handleDelete = async () => {
    try {
      await deleteStudent(studentId);

      success({
        title: "Success!",
        description: "Student deleted successfully",
        duration: 4000
      });

      setIsOpen(false);
    } catch (err: unknown) {
      console.error("Error deleting student:", err);
      error({
        title: "Delete Failed",
        description: err instanceof Error && 'response' in err 
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to delete student"
          : "Failed to delete student",
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
            Delete Student
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>
                Are you sure you want to delete this student? This action cannot be undone.
              </p>
              
              <div className="rounded-lg border p-3 bg-muted/50">
                <h4 className="font-medium text-sm">Student Details:</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>ID:</strong> {studentId}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Name:</strong> {student ? `${student.firstName} ${student.lastName}` : "Unknown"}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Email:</strong> {student?.email || "Unknown"}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Phone:</strong> {student?.phoneNumber || "N/A"}
                </p>
              </div>

              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-yellow-600 mb-2">⚠️ This may affect:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Course enrollments for this student</li>
                  <li>Attendance records in sessions</li>
                  <li>Academic progress and grade records</li>
                  <li>Session participation history</li>
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
              "Delete Student"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default StudentDeleteForm;