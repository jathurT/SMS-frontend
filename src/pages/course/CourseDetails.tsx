import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCourseContext } from "@/contexts/courseContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { LecturerSearchableDropdown } from "@/components/ui/lecturer-dropdown";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  User,
  GraduationCap,
  Clock,
  Users,
  UserPlus,
  Key,
  Building,
} from "lucide-react";
import Lorder from "@/components/Lorder";
import { Label } from "@/components/ui/label";

// Add Lecturer Form Component
function AddLecturerForm({
  courseId,
  setIsOpen,
}: {
  courseId: number;
  setIsOpen: (open: boolean) => void;
}) {
  const [lecturerId, setLecturerId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { addLecturerToCourse } = useCourseContext();
  const { success, error } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lecturerId.trim()) return;

    setIsLoading(true);
    try {
      await addLecturerToCourse(courseId, parseInt(lecturerId));
      success({
        title: "Success!",
        description: "Lecturer added to course successfully",
        duration: 4000,
      });
      setIsOpen(false);
    } catch (err) {
      console.error("Error adding lecturer:", err);
      error({
        title: "Failed",
        description: "Failed to add lecturer to course",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="lecturerId">
          Lecturer ID <span className="text-red-500">*</span>
        </Label>
        <LecturerSearchableDropdown
          value={lecturerId}
          onChange={setLecturerId}
          disabled={isLoading}
          placeholder="Search lecturer by name, email, or department..."
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsOpen(false)}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || !lecturerId.trim()}>
          {isLoading ? "Adding..." : "Add Lecturer"}
        </Button>
      </div>
    </form>
  );
}

export default function CourseDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, fetchCourseDetails } = useCourseContext();
  const [isAddLecturerOpen, setIsAddLecturerOpen] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;

      try {
        await fetchCourseDetails(parseInt(id));
      } catch (err: any) {
        console.error("Error fetching course details:", err);
      }
    };

    fetchDetails();
  }, [id, fetchCourseDetails]);

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
          <Button onClick={() => navigate("/course")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  if (!state.courseDetails) {
    return (
      <div className="flex w-full h-screen justify-center items-center">
        <div className="text-center space-y-4">
          <div className="text-gray-500">Course not found</div>
          <Button onClick={() => navigate("/course")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  const courseDetails = state.courseDetails;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    const time = new Date(`1970-01-01T${timeString}`);
    return time.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getSemesterColor = (semester: string) => {
    switch (semester.toUpperCase()) {
      case "FALL":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "SPRING":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "SUMMER":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "WINTER":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      default:
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      {/* Add Lecturer Dialog */}
      <ResponsiveDialog
        isOpen={isAddLecturerOpen}
        setIsOpen={setIsAddLecturerOpen}
        title="Add Lecturer to Course"
        className="sm:max-w-md"
      >
        <AddLecturerForm
          courseId={courseDetails.courseId}
          setIsOpen={setIsAddLecturerOpen}
        />
      </ResponsiveDialog>

      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          onClick={() => navigate("/course")}
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </Button>
        <Button
          onClick={() => setIsAddLecturerOpen(true)}
          className="flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Add Lecturer
        </Button>
      </div>

      {/* Course Profile Card */}
      <Card className="w-full">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
                {courseDetails.courseCode}
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">
                  {courseDetails.courseName}
                </CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {courseDetails.courseCode}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <User className="h-3 w-3" />
                ID: {courseDetails.courseId}
              </Badge>
              <Badge
                variant="secondary"
                className={getSemesterColor(courseDetails.semester)}
              >
                {courseDetails.semester}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Course Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Course Information
              </h3>
              <div className="space-y-2 pl-7">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  <span>Enrollment Key: {courseDetails.enrollmentKey}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span>Credits: {courseDetails.credits}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>Department: {courseDetails.departmentName}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Course Details
              </h3>
              <div className="space-y-2 pl-7">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Created: {formatDate(courseDetails.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Semester: {courseDetails.semester}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Academic Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {courseDetails.totalStudentsEnrolled}
                </div>
                <div className="text-sm text-muted-foreground">
                  Students Enrolled
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {courseDetails.totalSessionsConducted}
                </div>
                <div className="text-sm text-muted-foreground">
                  Sessions Conducted
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {courseDetails.lecturers?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  Assigned Lecturers
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Assigned Lecturers */}
          <div className="space-y-4">
            <h3 className="font-semibold text-xl flex items-center gap-2">
              <GraduationCap className="h-6 w-6" />
              Assigned Lecturers ({courseDetails.lecturers?.length || 0})
            </h3>

            {courseDetails.lecturers && courseDetails.lecturers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courseDetails.lecturers.map((lecturer, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {lecturer.firstName[0]}
                            {lecturer.lastName[0]}
                          </div>
                          <div>
                            <h4 className="font-semibold text-base">
                              {lecturer.firstName} {lecturer.lastName}
                            </h4>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              <span>{lecturer.email}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8">
                <div className="text-center text-muted-foreground">
                  <GraduationCap className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No lecturers assigned</p>
                </div>
              </Card>
            )}
          </div>

          <Separator />

          {/* Enrolled Students */}
          <div className="space-y-4">
            <h3 className="font-semibold text-xl flex items-center gap-2">
              <Users className="h-6 w-6" />
              Enrolled Students ({courseDetails.enrolledStudents?.length || 0})
            </h3>

            {courseDetails.enrolledStudents &&
            courseDetails.enrolledStudents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courseDetails.enrolledStudents.map((student, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {student.firstName[0]}
                          </div>
                          <div>
                            <h4 className="font-semibold text-base">
                              {student.firstName}
                            </h4>
                          </div>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span>{student.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span>{student.phoneNumber}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8">
                <div className="text-center text-muted-foreground">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No students enrolled</p>
                </div>
              </Card>
            )}
          </div>

          <Separator />

          {/* Conducted Sessions */}
          <div className="space-y-4">
            <h3 className="font-semibold text-xl flex items-center gap-2">
              <Clock className="h-6 w-6" />
              Conducted Sessions ({courseDetails.conductedSessions?.length || 0}
              )
            </h3>

            {courseDetails.conductedSessions &&
            courseDetails.conductedSessions.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {courseDetails.conductedSessions.map((session) => (
                  <Card
                    key={session.sessionId}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">
                              Session with {session.lecturerName}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <div>Date: {formatDate(session.date)}</div>
                            <div>
                              Time: {formatTime(session.startTime)} -{" "}
                              {formatTime(session.endTime)}
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className="text-blue-600 border-blue-600"
                        >
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
                  <p>No sessions conducted yet</p>
                </div>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
