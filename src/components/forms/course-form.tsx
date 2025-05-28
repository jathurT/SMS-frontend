import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCourseContext } from "@/contexts/courseContext";
import { useDepartmentContext } from "@/contexts/departmentContext";
import { CreateCourse } from "@/types/course";
import { Loader2 } from "lucide-react";

interface CourseFormProps {
  setIsOpen: (open: boolean) => void;
}

// Updated CreateCourse type to use departmentId instead of departmentName
type CreateCourseWithDepartmentId = Omit<CreateCourse, 'departmentName'> & {
  departmentId: number;
};

// Define a proper error type that allows string messages for each field
type FormErrors = {
  [K in keyof CreateCourseWithDepartmentId]?: string;
};

function CourseForm({ setIsOpen }: CourseFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateCourseWithDepartmentId>({
    courseName: "",
    courseCode: "",
    enrollmentKey: "",
    credits: 0,
    semester: "",
    departmentId: 0,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const { success, error, info } = useToast();
  const { state, createCourse } = useCourseContext();
  const { state: departmentState } = useDepartmentContext();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.courseName.trim()) {
      newErrors.courseName = "Course name is required";
    } else if (formData.courseName.trim().length < 2) {
      newErrors.courseName = "Course name must be at least 2 characters";
    } else if (formData.courseName.trim().length > 100) {
      newErrors.courseName = "Course name must be less than 100 characters";
    }

    if (!formData.courseCode.trim()) {
      newErrors.courseCode = "Course code is required";
    } else if (formData.courseCode.trim().length < 2) {
      newErrors.courseCode = "Course code must be at least 2 characters";
    } else if (formData.courseCode.trim().length > 20) {
      newErrors.courseCode = "Course code must be less than 20 characters";
    }

    if (!formData.enrollmentKey.trim()) {
      newErrors.enrollmentKey = "Enrollment key is required";
    } else if (formData.enrollmentKey.trim().length < 4) {
      newErrors.enrollmentKey = "Enrollment key must be at least 4 characters";
    } else if (formData.enrollmentKey.trim().length > 50) {
      newErrors.enrollmentKey = "Enrollment key must be less than 50 characters";
    }

    if (!formData.credits || formData.credits <= 0) {
      newErrors.credits = "Credits must be a positive number";
    } else if (formData.credits > 10) {
      newErrors.credits = "Credits cannot exceed 10";
    }

    if (!formData.semester.trim()) {
      newErrors.semester = "Semester is required";
    } else if (formData.semester.trim().length > 20) {
      newErrors.semester = "Semester must be less than 20 characters";
    }

    if (!formData.departmentId || formData.departmentId <= 0) {
      newErrors.departmentId = "Department is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    // Show processing toast
    info({
      title: "Creating...",
      description: "Setting up new course",
      duration: 2000
    });

    try {
      // Find the selected department name to send to the API
      const selectedDepartment = departmentState.departments.find(
        dept => dept.departmentId === formData.departmentId
      );

      await createCourse({
        courseName: formData.courseName.trim(),
        courseCode: formData.courseCode.trim().toUpperCase(),
        enrollmentKey: formData.enrollmentKey.trim(),
        credits: formData.credits,
        semester: formData.semester.trim(),
        departmentName: selectedDepartment?.departmentName || "",
      });

      success({
        title: "Course Created!",
        description: `${formData.courseName.trim()} (${formData.courseCode.trim().toUpperCase()}) has been successfully created`,
        duration: 4000
      });

      // Reset form and close dialog
      setFormData({
        courseName: "",
        courseCode: "",
        enrollmentKey: "",
        credits: 0,
        semester: "",
        departmentId: 0,
      });
      setIsOpen(false);
    } catch (err: unknown) {
      console.error("Error creating course:", err);
      const errorMessage = err instanceof Error && 'response' in err && 
        typeof err.response === 'object' && err.response !== null &&
        'data' in err.response && typeof err.response.data === 'object' &&
        err.response.data !== null && 'message' in err.response.data &&
        typeof err.response.data.message === 'string'
        ? err.response.data.message
        : state.error || "Failed to create course";
      
      error({
        title: "Creation Failed",
        description: errorMessage,
        duration: 6000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateCourseWithDepartmentId, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleDepartmentChange = (value: string) => {
    const departmentId = parseInt(value);
    handleInputChange("departmentId", departmentId);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Course Name */}
        <div className="space-y-2">
          <Label htmlFor="courseName">
            Course Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="courseName"
            type="text"
            placeholder="Enter course name"
            value={formData.courseName}
            onChange={(e) => handleInputChange("courseName", e.target.value)}
            className={errors.courseName ? "border-red-500" : ""}
            disabled={isLoading || state.loading}
            maxLength={100}
          />
          {errors.courseName && (
            <p className="text-sm text-red-500">{errors.courseName}</p>
          )}
        </div>

        {/* Course Code */}
        <div className="space-y-2">
          <Label htmlFor="courseCode">
            Course Code <span className="text-red-500">*</span>
          </Label>
          <Input
            id="courseCode"
            type="text"
            placeholder="Enter course code (e.g., CS101)"
            value={formData.courseCode}
            onChange={(e) => handleInputChange("courseCode", e.target.value.toUpperCase())}
            className={errors.courseCode ? "border-red-500" : ""}
            disabled={isLoading || state.loading}
            maxLength={20}
          />
          {errors.courseCode && (
            <p className="text-sm text-red-500">{errors.courseCode}</p>
          )}
        </div>

        {/* Enrollment Key */}
        <div className="space-y-2">
          <Label htmlFor="enrollmentKey">
            Enrollment Key <span className="text-red-500">*</span>
          </Label>
          <Input
            id="enrollmentKey"
            type="text"
            placeholder="Enter enrollment key"
            value={formData.enrollmentKey}
            onChange={(e) => handleInputChange("enrollmentKey", e.target.value)}
            className={errors.enrollmentKey ? "border-red-500" : ""}
            disabled={isLoading || state.loading}
            maxLength={50}
          />
          {errors.enrollmentKey && (
            <p className="text-sm text-red-500">{errors.enrollmentKey}</p>
          )}
        </div>

        {/* Credits */}
        <div className="space-y-2">
          <Label htmlFor="credits">
            Credits <span className="text-red-500">*</span>
          </Label>
          <Input
            id="credits"
            type="number"
            placeholder="Enter credits"
            value={formData.credits || ""}
            onChange={(e) => handleInputChange("credits", parseInt(e.target.value) || 0)}
            className={errors.credits ? "border-red-500" : ""}
            disabled={isLoading || state.loading}
            min="1"
            max="10"
          />
          {errors.credits && (
            <p className="text-sm text-red-500">{errors.credits}</p>
          )}
        </div>

        {/* Semester */}
        <div className="space-y-2">
          <Label htmlFor="semester">
            Semester <span className="text-red-500">*</span>
          </Label>
          <Input
            id="semester"
            type="text"
            placeholder="Enter semester (e.g., Fall 2024)"
            value={formData.semester}
            onChange={(e) => handleInputChange("semester", e.target.value)}
            className={errors.semester ? "border-red-500" : ""}
            disabled={isLoading || state.loading}
            maxLength={20}
          />
          {errors.semester && (
            <p className="text-sm text-red-500">{errors.semester}</p>
          )}
        </div>

        {/* Department Dropdown */}
        <div className="space-y-2">
          <Label htmlFor="department">
            Department <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.departmentId > 0 ? formData.departmentId.toString() : ""}
            onValueChange={handleDepartmentChange}
            disabled={isLoading || state.loading || departmentState.loading}
          >
            <SelectTrigger className={errors.departmentId ? "border-red-500" : ""}>
              <SelectValue placeholder="Select a department" />
            </SelectTrigger>
            <SelectContent>
              {departmentState.loading ? (
                <SelectItem value="loading" disabled>
                  <div className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading departments...
                  </div>
                </SelectItem>
              ) : departmentState.departments.length === 0 ? (
                <SelectItem value="no-departments" disabled>
                  No departments available
                </SelectItem>
              ) : (
                departmentState.departments.map((department) => (
                  <SelectItem
                    key={department.departmentId}
                    value={department.departmentId.toString()}
                  >
                    {department.departmentName}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {errors.departmentId && (
            <p className="text-sm text-red-500">{errors.departmentId}</p>
          )}
          {departmentState.error && (
            <p className="text-sm text-orange-500">
              Error loading departments: {departmentState.error}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsOpen(false)}
          disabled={isLoading || state.loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || state.loading}>
          {isLoading || state.loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Course"
          )}
        </Button>
      </div>
    </form>
  );
}

export default CourseForm;