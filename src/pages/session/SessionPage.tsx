import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useSessionContext } from "@/contexts/sessionContext";
import { useDepartmentContext } from "@/contexts/departmentContext";
import { useCourseContext } from "@/contexts/courseContext";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import Lorder from "@/components/Lorder";
import { 
  Building2, 
  BookOpen, 
  ArrowLeft,
  Clock,
  Calendar,
  Hash,
  GraduationCap,
  Users
} from "lucide-react";
import { Department } from "@/types/department";
import { Course } from "@/types/course";

export default function SessionPage() {
  const { state: sessionState, fetchSessionsByCourse, clearSessions } = useSessionContext();
  const { state: departmentState, fetchDepartments } = useDepartmentContext();
  const { state: courseState, fetchCoursesByDepartment, clearCourses } = useCourseContext();

  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Fetch departments on component mount
  useEffect(() => {
    if (departmentState.departments.length === 0) {
      fetchDepartments();
    }
  }, [departmentState.departments.length, fetchDepartments]);

  // Department Selection Handler
  const handleDepartmentSelect = async (department: Department) => {
    setSelectedDepartment(department);
    setSelectedCourse(null);
    clearSessions();
    
    try {
      await fetchCoursesByDepartment(department.departmentId);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // Course Selection Handler
  const handleCourseSelect = async (course: Course) => {
    setSelectedCourse(course);
    
    try {
      await fetchSessionsByCourse(course.courseId);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  // Back Navigation Handlers
  const handleBackToDepartments = () => {
    setSelectedDepartment(null);
    setSelectedCourse(null);
    clearCourses();
    clearSessions();
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
    clearSessions();
  };

  // Utility Functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Loading States
  if (departmentState.loading && departmentState.departments.length === 0) {
    return (
      <div className="flex w-full h-screen justify-center items-center">
        <Lorder />
      </div>
    );
  }

  // Department Selection View
  if (!selectedDepartment) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Clock className="h-8 w-8" />
            Session Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Select a department to view and manage sessions
          </p>
        </div>

        {departmentState.error ? (
          <Card className="p-8">
            <div className="text-center text-red-500">
              Error: {departmentState.error}
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departmentState.departments.map((department) => (
              <Card 
                key={department.departmentId} 
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => handleDepartmentSelect(department)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Building2 className="h-8 w-8 text-blue-600 group-hover:text-blue-700" />
                    <Badge variant="secondary">
                      ID: {department.departmentId}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-lg mb-2 group-hover:text-blue-600 transition-colors">
                    {department.departmentName}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Click to view courses and sessions
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Course Selection View
  if (selectedDepartment && !selectedCourse) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="mb-6">
          <Button 
            onClick={handleBackToDepartments} 
            variant="ghost" 
            size="sm"
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Departments
          </Button>
          
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="h-6 w-6 text-blue-600" />
            <h1 className="text-3xl font-bold">{selectedDepartment.departmentName}</h1>
          </div>
          <p className="text-muted-foreground">
            Select a course to view and manage sessions
          </p>
        </div>

        {courseState.loading ? (
          <div className="flex justify-center items-center py-12">
            <Lorder />
          </div>
        ) : courseState.error ? (
          <Card className="p-8">
            <div className="text-center text-red-500">
              Error: {courseState.error}
            </div>
          </Card>
        ) : courseState.courses.length === 0 ? (
          <Card className="p-8">
            <div className="text-center text-muted-foreground">
              <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No courses found in this department</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseState.courses.map((course) => (
              <Card 
                key={course.courseId} 
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => handleCourseSelect(course)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <BookOpen className="h-8 w-8 text-green-600 group-hover:text-green-700" />
                    <Badge variant="secondary">
                      {course.courseCode}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <CardTitle className="text-lg group-hover:text-green-600 transition-colors">
                    {course.courseName}
                  </CardTitle>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <span>Course ID: {course.courseId}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span>{course.credits} Credits</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{course.semester}</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    Click to view sessions
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Session Management View
  if (selectedDepartment && selectedCourse) {
    return (
      <div className="container mx-auto py-6 px-4">
        {/* Navigation Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Button 
              onClick={handleBackToDepartments} 
              variant="ghost" 
              size="sm"
            >
              <Building2 className="h-4 w-4 mr-1" />
              {selectedDepartment.departmentName}
            </Button>
            <span>/</span>
            <Button 
              onClick={handleBackToCourses} 
              variant="ghost" 
              size="sm"
            >
              <BookOpen className="h-4 w-4 mr-1" />
              Courses
            </Button>
            <span>/</span>
            <span className="font-medium">Sessions</span>
          </div>
          
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Clock className="h-8 w-8" />
              Course Sessions
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage sessions for {selectedCourse.courseCode} - {selectedCourse.courseName}
            </p>
          </div>
        </div>

        {/* Course Information Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Course Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Course Code</p>
                <p className="text-lg font-semibold">{selectedCourse.courseCode}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Course Name</p>
                <p className="text-lg font-semibold">{selectedCourse.courseName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Credits</p>
                <p className="text-lg font-semibold">{selectedCourse.credits}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Semester</p>
                <Badge variant="outline" className="text-base">
                  {selectedCourse.semester}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator className="mb-6" />

        {/* Sessions Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Course Sessions ({sessionState.sessions.length})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {sessionState.loading ? (
              <div className="flex justify-center items-center py-12">
                <Lorder />
              </div>
            ) : sessionState.error ? (
              <div className="text-center text-red-500 py-8">
                Error: {sessionState.error}
              </div>
            ) : (
              <DataTable 
                columns={columns} 
                data={sessionState.sessions}
                enableRowClick={true}
                courseId={selectedCourse.courseId}
              />
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}