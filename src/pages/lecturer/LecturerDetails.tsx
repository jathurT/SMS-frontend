import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLecturerContext, LecturerDetailsData } from "@/contexts/lecturerContext";
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
  Building2,
  User,
  GraduationCap
} from "lucide-react";
import Lorder from "@/components/Lorder";

export default function LecturerDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchLecturerDetails, state } = useLecturerContext();

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;

      try {
        await fetchLecturerDetails(parseInt(id));
      } catch (err: any) {
        console.error("Error fetching lecturer details:", err);
      }
    };

    fetchDetails();
  }, [id, fetchLecturerDetails]);

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
          <Button onClick={() => navigate("/lecturers")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Lecturers
          </Button>
        </div>
      </div>
    );
  }

  if (!state.lecturerDetails) {
    return (
      <div className="flex w-full h-screen justify-center items-center">
        <div className="text-center space-y-4">
          <div className="text-gray-500">Lecturer not found</div>
          <Button onClick={() => navigate("/lecturers")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Lecturers
          </Button>
        </div>
      </div>
    );
  }

  const lecturerDetails = state.lecturerDetails;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getSemesterColor = (semester: string) => {
    switch (semester.toUpperCase()) {
      case 'FALL':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'SPRING':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'SUMMER':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'WINTER':
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
          onClick={() => navigate("/lecturer")} 
          variant="ghost" 
          size="sm"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Lecturers
        </Button>
      </div>

      {/* Lecturer Profile Card */}
      <Card className="w-full">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {lecturerDetails.firstName[0]}{lecturerDetails.lastName[0]}
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">
                  {lecturerDetails.firstName} {lecturerDetails.lastName}
                </CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{lecturerDetails.departmentName} Department</span>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
              <User className="h-3 w-3" />
              ID: {lecturerDetails.lecturerId}
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
                    href={`mailto:${lecturerDetails.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {lecturerDetails.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{lecturerDetails.phoneNumber}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="text-sm">{lecturerDetails.address}</span>
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
                  <span>Born: {formatDate(lecturerDetails.dateOfBirth)}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Teaching Modules */}
          <div className="space-y-4">
            <h3 className="font-semibold text-xl flex items-center gap-2">
              <GraduationCap className="h-6 w-6" />
              Teaching Modules ({lecturerDetails.courses.length})
            </h3>
            
            {lecturerDetails.courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lecturerDetails.courses.map((course) => (
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
                  <p>No courses assigned to this lecturer</p>
                </div>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}