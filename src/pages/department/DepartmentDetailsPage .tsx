import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDepartmentContext } from "@/contexts/departmentContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Users, 
  BookOpen, 
  GraduationCap,
  Mail,
  User,
  Calendar,
  Building2
} from "lucide-react";
import Lorder from "@/components/Lorder";

interface DepartmentAnalyticsDetail {
  departmentId: number;
  departmentName: string;
  lecturers: Array<{
    firstName: string;
    lastName: string;
    email: string;
  }>;
  totalLecturers: number;
  totalCourses: number;
  courses: Array<{
    courseId: number;
    courseName: string;
    courseCode: string;
    semester: string;
  }>;
}

export default function DepartmentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchDepartmentAnalyticsById } = useDepartmentContext();
  
  const [departmentAnalytics, setDepartmentAnalytics] = useState<DepartmentAnalyticsDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartmentAnalytics = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const analytics = await fetchDepartmentAnalyticsById(parseInt(id));
        setDepartmentAnalytics(analytics);
      } catch (err: any) {
        console.error('Error fetching department analytics:', err);
        setError(err.message || 'Failed to fetch department details');
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentAnalytics();
  }, [id, fetchDepartmentAnalyticsById]);

  const handleGoBack = () => {
    navigate('/department');
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getSemesterColor = (semester: string) => {
    switch (semester.toLowerCase()) {
      case 'fall': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'spring': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'summer': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'winter': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex w-full h-screen justify-center items-center">
        <Lorder />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex w-full h-screen justify-center items-center">
        <div className="text-center space-y-4">
          <div className="text-destructive">Error: {error}</div>
          <Button onClick={handleGoBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!departmentAnalytics) {
    return (
      <div className="flex w-full h-screen justify-center items-center">
        <div className="text-center space-y-4">
          <div className="text-muted-foreground">Department not found</div>
          <Button onClick={handleGoBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button onClick={handleGoBack} variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Departments
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {departmentAnalytics.departmentName}
            </h1>
            <p className="text-muted-foreground">Department ID: {departmentAnalytics.departmentId}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Building2 className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-300">
              Total Lecturers
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-200">
              {departmentAnalytics.totalLecturers}
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800 dark:text-green-300">
              Total Courses
            </CardTitle>
            <BookOpen className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-200">
              {departmentAnalytics.totalCourses}
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50/50 dark:border-purple-800 dark:bg-purple-950/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-300">
              Active Programs
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-200">
              {new Set(departmentAnalytics.courses.map(c => c.semester)).size}
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              Semesters
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lecturers Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span>Department Lecturers</span>
              <Badge variant="secondary" className="ml-2">
                {departmentAnalytics.totalLecturers}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {departmentAnalytics.lecturers.length > 0 ? (
              departmentAnalytics.lecturers.map((lecturer, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 rounded-lg border bg-muted/30">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-semibold">
                      {getInitials(lecturer.firstName, lecturer.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium text-foreground">
                        {lecturer.firstName} {lecturer.lastName}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">{lecturer.email}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No lecturers assigned to this department</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Courses Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-green-600" />
              <span>Department Courses</span>
              <Badge variant="secondary" className="ml-2">
                {departmentAnalytics.totalCourses}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {departmentAnalytics.courses.length > 0 ? (
              departmentAnalytics.courses.map((course) => (
                <div key={course.courseId} className="p-4 rounded-lg border bg-muted/30 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium text-foreground">{course.courseName}</h4>
                      <p className="text-sm text-muted-foreground">Course ID: {course.courseId}</p>
                    </div>
                    <Badge variant="outline" className={getSemesterColor(course.semester)}>
                      <Calendar className="h-3 w-3 mr-1" />
                      {course.semester}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      {course.courseCode}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No courses available in this department</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Department Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {departmentAnalytics.totalLecturers}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">Total Lecturers</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950/30">
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                {departmentAnalytics.totalCourses}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">Total Courses</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30">
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {departmentAnalytics.courses.length > 0 
                  ? Math.round(departmentAnalytics.totalCourses / departmentAnalytics.totalLecturers * 10) / 10
                  : 0
                }
              </div>
              <div className="text-sm text-purple-600 dark:text-purple-400">Courses per Lecturer</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-orange-50 dark:bg-orange-950/30">
              <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                {new Set(departmentAnalytics.courses.map(c => c.semester)).size}
              </div>
              <div className="text-sm text-orange-600 dark:text-orange-400">Active Semesters</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}