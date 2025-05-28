import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStudentContext } from "@/contexts/studentContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  BookOpen,
  User,
  GraduationCap,
  Clock
} from "lucide-react";
import Lorder from "@/components/Lorder";

export default function StudentDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchStudentDetails, state } = useStudentContext();

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;

      try {
        await fetchStudentDetails(parseInt(id));
      } catch (err: any) {
        console.error("Error fetching student details:", err);
      }
    };

    fetchDetails();
  }, [id, fetchStudentDetails]);

  if (state.detailsLoading) {
    return (
      <div className="flex w-full h-screen justify-center items-center">
        <Lorder />
      </div>
    );
  }

  if (state.detailsError) {
    return (
      <div className="flex w-full h-screen justify-center items-center">
        <div className="text-center space-y-4">
          <div className="text-red-500">Error: {state.detailsError}</div>
          <Button onClick={() => navigate("/student")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Students
          </Button>
        </div>
      </div>
    );
  }

  if (!state.studentDetails) {
    return (
      <div className="flex w-full h-screen justify-center items-center">
        <div className="text-center space-y-4">
          <div className="text-gray-500">Student not found</div>
          <Button onClick={() => navigate("/student")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Students
          </Button>
        </div>
      </div>
    );
  }

  const studentDetails = state.studentDetails;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const time = new Date(`1970-01-01T${timeString}`);
    return time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getSemesterColor = (semester: string) => {
    switch (semester.toUpperCase()) {
      case 'FALL':
      case 'FALL 2023':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'SPRING':
      case 'SPRING 2023':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'SUMMER':
      case 'SUMMER 2023':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'WINTER':
      case 'WINTER 2023':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button 
          onClick={() => navigate("/student")} 
          variant="ghost" 
          size="sm"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Students
        </Button>
      </div>

      {/* Student Profile Card */}
      <Card className="w-full">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {studentDetails.firstName[0]}{studentDetails.lastName[0]}
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">
                  {studentDetails.firstName} {studentDetails.lastName}
                </CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Student</span>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
              <User className="h-3 w-3" />
              ID: {studentDetails.studentId}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Information
              </h3>
              <div className="space-y-2 pl-7">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={`mailto:${studentDetails.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {studentDetails.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{studentDetails.phoneNumber}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="text-sm">{studentDetails.address}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Personal Information
              </h3>
              <div className="space-y-2 pl-7">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Born: {formatDate(studentDetails.dateOfBirth)}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Academic Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{studentDetails.totalCoursesEnrolled}</div>
                <div className="text-sm text-muted-foreground">Courses Enrolled</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{studentDetails.totalSessionsAttended}</div>
                <div className="text-sm text-muted-foreground">Sessions Attended</div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Enrolled Courses */}
          <div className="space-y-4">
            <h3 className="font-semibold text-xl flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              Enrolled Courses ({studentDetails.courses.length})
            </h3>
            
            {studentDetails.courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {studentDetails.courses.map((course) => (
                  <Card key={course.courseId} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-sm">{course.courseCode}</span>
                          </div>
                          <Badge 
                            variant="secondary" 
                            className={getSemesterColor(course.semester)}
                          >
                            {course.semester}
                          </Badge>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-base leading-tight">
                            {course.courseName}
                          </h4>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Course ID: {course.courseId}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8">
                <div className="text-center text-muted-foreground">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No courses enrolled</p>
                </div>
              </Card>
            )}
          </div>

          <Separator />

          {/* Sessions Attended */}
          <div className="space-y-4">
            <h3 className="font-semibold text-xl flex items-center gap-2">
              <Clock className="h-6 w-6" />
              Sessions Attended ({studentDetails.sessionsAttended.length})
            </h3>
            
            {studentDetails.sessionsAttended.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {studentDetails.sessionsAttended.map((session) => (
                  <Card key={session.sessionId} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-green-600" />
                            <span className="font-medium">{session.courseCode} - {session.courseName}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <div>Lecturer: {session.lecturerName}</div>
                            <div>Date: {formatDate(session.date)}</div>
                            <div>Time: {formatTime(session.startTime)} - {formatTime(session.endTime)}</div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Session {session.sessionId}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8">
                <div className="text-center text-muted-foreground">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No sessions attended yet</p>
                </div>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}