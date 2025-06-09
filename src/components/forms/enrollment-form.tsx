// components/forms/enrollment-form.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useEnrollmentContext } from "@/contexts/enrollmentContext";
import { useStudentContext } from "@/contexts/studentContext";
import { CreateEnrollmentRequest } from "@/types/enrollment";
import { Loader2, Search, User, X, CheckCircle } from "lucide-react";

interface EnrollmentFormProps {
  courseId: number;
  courseName: string;
  courseCode: string;
  setIsOpen: (open: boolean) => void;
}

export default function EnrollmentForm({ 
  courseId, 
  courseName, 
  courseCode, 
  setIsOpen 
}: EnrollmentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { createEnrollment, state: enrollmentState } = useEnrollmentContext();
  const { state: studentState, fetchStudents } = useStudentContext();
  const { success, error, info } = useToast();
  
  const [formData, setFormData] = useState<CreateEnrollmentRequest>({
    studentId: 0,
    enrollmentKey: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStudents, setFilteredStudents] = useState(studentState.students);
  const [errors, setErrors] = useState<{
    studentId?: string;
    enrollmentKey?: string;
  }>({});

  useEffect(() => {
    if (studentState.students.length === 0) {
      fetchStudents();
    }
  }, [studentState.students.length, fetchStudents]);

  // Enhanced filtering logic
  useEffect(() => {
    if (!studentState.students.length) return;

    let filtered = studentState.students;
    
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = studentState.students.filter(student => {
        const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
        const email = student.email.toLowerCase();
        const studentId = student.studentId.toString();
        
        return (
          fullName.includes(searchLower) ||
          student.firstName.toLowerCase().includes(searchLower) ||
          student.lastName.toLowerCase().includes(searchLower) ||
          email.includes(searchLower) ||
          studentId.includes(searchTerm.trim())
        );
      });
    }

    setFilteredStudents(filtered);
  }, [searchTerm, studentState.students]);

  const validateForm = (): boolean => {
    const newErrors: {
      studentId?: string;
      enrollmentKey?: string;
    } = {};

    if (!formData.studentId || formData.studentId === 0) {
      newErrors.studentId = "Student selection is required";
    }

    if (!formData.enrollmentKey.trim()) {
      newErrors.enrollmentKey = "Enrollment key is required";
    } else if (formData.enrollmentKey.trim().length < 3) {
      newErrors.enrollmentKey = "Enrollment key must be at least 3 characters";
    } else if (formData.enrollmentKey.trim().length > 50) {
      newErrors.enrollmentKey = "Enrollment key must be less than 50 characters";
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
    
    info({
      title: "Creating Enrollment...",
      description: "Setting up student enrollment",
      duration: 2000
    });

    try {
      await createEnrollment(courseId, {
        studentId: formData.studentId,
        enrollmentKey: formData.enrollmentKey.trim(),
      });

      const selectedStudent = studentState.students.find(s => s.studentId === formData.studentId);
      const studentName = selectedStudent ? `${selectedStudent.firstName} ${selectedStudent.lastName}` : "Student";

      success({
        title: "Enrollment Created!",
        description: `${studentName} has been successfully enrolled in ${courseCode}`,
        duration: 4000
      });

      // Reset form and close dialog
      setFormData({ studentId: 0, enrollmentKey: "" });
      setSearchTerm("");
      setIsOpen(false);
    } catch (err: any) {
      console.error("Error creating enrollment:", err);
      error({
        title: "Enrollment Failed",
        description: err.response?.data?.message || enrollmentState.error || "Failed to create enrollment",
        duration: 6000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateEnrollmentRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing/selecting
    if (field === 'studentId' && errors.studentId) {
      setErrors(prev => ({ ...prev, studentId: undefined }));
    } else if (field === 'enrollmentKey' && errors.enrollmentKey) {
      setErrors(prev => ({ ...prev, enrollmentKey: undefined }));
    }
  };

  const handleStudentSelect = (studentId: string) => {
    handleInputChange("studentId", parseInt(studentId));
    setSearchTerm(""); // Clear search after selection
  };

  const handleClearStudent = () => {
    setFormData(prev => ({ ...prev, studentId: 0 }));
    setSearchTerm("");
    if (errors.studentId) {
      setErrors(prev => ({ ...prev, studentId: undefined }));
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const selectedStudent = studentState.students.find(s => s.studentId === formData.studentId);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Course Information */}
      <div className="bg-muted/50 p-4 rounded-lg">
        <h3 className="font-semibold text-lg mb-2">Course Information</h3>
        <div className="space-y-1">
          <p className="text-sm"><span className="font-medium">Course Code:</span> {courseCode}</p>
          <p className="text-sm"><span className="font-medium">Course Name:</span> {courseName}</p>
          <p className="text-sm"><span className="font-medium">Course ID:</span> {courseId}</p>
        </div>
      </div>

      {/* Student Selection */}
      <div className="space-y-4">
        <Label htmlFor="student-search" className="text-sm font-medium">
          Select Student <span className="text-red-500">*</span>
        </Label>
        
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            id="student-search"
            placeholder="Search by name, email, or student ID..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 pr-10"
            disabled={isLoading || enrollmentState.creating}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Student Selection - Only show when searching */}
        {searchTerm && (
          <div className="border rounded-md max-h-60 overflow-y-auto bg-background">
            {studentState.loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2 text-sm">Loading students...</span>
              </div>
            ) : filteredStudents.length > 0 ? (
              <>
                <div className="px-3 py-2 text-xs text-muted-foreground border-b bg-muted/30">
                  {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''} found
                </div>
                <div className="divide-y">
                  {filteredStudents.map((student) => (
                    <button
                      key={student.studentId}
                      type="button"
                      onClick={() => handleStudentSelect(student.studentId.toString())}
                      className="w-full text-left px-3 py-3 hover:bg-muted/50 transition-colors"
                      disabled={isLoading || enrollmentState.creating}
                    >
                      <div className="flex items-center space-x-3">
                        <User className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">
                            {student.firstName} {student.lastName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ID: {student.studentId} • {student.email}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="py-8 text-center text-sm text-muted-foreground">
                <div>No students found matching "{searchTerm}"</div>
                <div className="text-xs mt-1">Try a different search term</div>
              </div>
            )}
          </div>
        )}

        {/* Alternative: Show dropdown when not searching and no student selected */}
        {!searchTerm && !selectedStudent && (
          <Select
            value=""
            onValueChange={(value) => handleStudentSelect(value)}
            disabled={isLoading || enrollmentState.creating}
          >
            <SelectTrigger className={`w-full ${errors.studentId ? "border-red-500" : ""}`}>
              <SelectValue placeholder="Or choose from all students..." />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {studentState.loading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="ml-2 text-sm">Loading students...</span>
                </div>
              ) : studentState.students.length > 0 ? (
                studentState.students.map((student) => (
                  <SelectItem key={student.studentId} value={student.studentId.toString()}>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 flex-shrink-0" />
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">
                          {student.firstName} {student.lastName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ID: {student.studentId} • {student.email}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                ))
              ) : (
                <div className="py-4 text-center text-sm text-muted-foreground">
                  No students available
                </div>
              )}
            </SelectContent>
          </Select>
        )}
        
        {errors.studentId && (
          <p className="text-sm text-red-500">{errors.studentId}</p>
        )}

        {/* Selected Student Preview */}
        {selectedStudent && (
          <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800 dark:text-green-200">Selected Student:</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearStudent}
                className="h-6 w-6 p-0 text-green-600 hover:text-green-800 hover:bg-green-100 dark:hover:bg-green-900"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {selectedStudent.firstName} {selectedStudent.lastName}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  ID: {selectedStudent.studentId}
                </Badge>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                {selectedStudent.email}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Enrollment Key */}
      <div className="space-y-2">
        <Label htmlFor="enrollment-key" className="text-sm font-medium">
          Enrollment Key <span className="text-red-500">*</span>
        </Label>
        <Input
          id="enrollment-key"
          type="text"
          value={formData.enrollmentKey}
          onChange={(e) => handleInputChange("enrollmentKey", e.target.value)}
          placeholder="Enter enrollment key"
          className={errors.enrollmentKey ? "border-red-500" : ""}
          disabled={isLoading || enrollmentState.creating}
          maxLength={50}
        />
        {errors.enrollmentKey && (
          <p className="text-sm text-red-500">{errors.enrollmentKey}</p>
        )}
        <p className="text-xs text-muted-foreground">
          {formData.enrollmentKey.length}/50 characters
        </p>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button" 
          variant="outline" 
          onClick={() => setIsOpen(false)}
          disabled={isLoading || enrollmentState.creating}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading || enrollmentState.creating || !formData.studentId}
        >
          {isLoading || enrollmentState.creating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Enrollment"
          )}
        </Button>
      </div>
    </form>
  );
}