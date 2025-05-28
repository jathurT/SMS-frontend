import { useToast } from "@/hooks/use-toast";
import { useCourseContext } from "@/contexts/courseContext";
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

interface CourseDeleteFormProps {
  courseId: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

function CourseDeleteForm({ 
  courseId, 
  isOpen,
  setIsOpen 
}: CourseDeleteFormProps) {
  const { success, error } = useToast(); // Using enhanced toast methods
  const { state, deleteCourse } = useCourseContext();

  // Use the loading state from the context
  const isLoading = state.loading;

  // Find the course to get their details for confirmation
  const course = state.courses.find(
    course => course.courseId === courseId
  );

  const handleDelete = async () => {
    try {
      await deleteCourse(courseId);

      success({
        title: "Success!",
        description: "Course deleted successfully",
        duration: 4000
      });

      setIsOpen(false);
    } catch (err: unknown) {
      console.error("Error deleting course:", err);
      error({
        title: "Delete Failed",
        description: err instanceof Error && 'response' in err 
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to delete course"
          : "Failed to delete course",
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
            Delete Course
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>
                Are you sure you want to delete this course? This action cannot be undone.
              </p>
              
              <div className="rounded-lg border p-3 bg-muted/50">
                <h4 className="font-medium text-sm">Course Details:</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>ID:</strong> {courseId}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Name:</strong> {course?.courseName || "Unknown"}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Code:</strong> {course?.courseCode || "Unknown"}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Credits:</strong> {course?.credits || "N/A"}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Semester:</strong> {course?.semester || "N/A"}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Department:</strong> {course?.departmentName || "N/A"}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Enrolled Students:</strong> {course?.totalStudentsEnrolled || 0}
                </p>
              </div>

              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-yellow-600 mb-2">⚠️ This may affect:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Student enrollments for this course</li>
                  <li>Session records and attendance data</li>
                  <li>Lecturer assignments to this course</li>
                  <li>Academic progress and grade records</li>
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
              "Delete Course"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default CourseDeleteForm;