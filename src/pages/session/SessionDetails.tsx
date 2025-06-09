import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSessionContext } from "@/contexts/sessionContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Clock, 
  Calendar,
  BookOpen,
  User,
  GraduationCap,
  UserCheck,
  Users
} from "lucide-react";
import Lorder from "@/components/Lorder";

export default function SessionDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchSessionById, state } = useSessionContext();

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;

      try {
        await fetchSessionById(parseInt(id));
      } catch (err: any) {
        console.error("Error fetching session details:", err);
      }
    };

    fetchDetails();
  }, [id, fetchSessionById]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", 
      day: "numeric",
      weekday: "long"
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

  if (state.currentSessionLoading) {
    return (
      <div className="flex w-full h-screen justify-center items-center">
        <Lorder />
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="flex w-full h-screen justify-center items-center">
        <div className="text-center space-y-4">
          <div className="text-red-500">Error: {state.error}</div>
          <Button onClick={() => navigate("/session")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sessions
          </Button>
        </div>
      </div>
    );
  }

  if (!state.currentSession) {
    return (
      <div className="flex w-full h-screen justify-center items-center">
        <div className="text-center space-y-4">
          <div className="text-gray-500">Session not found</div>
          <Button onClick={() => navigate("/session")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sessions
          </Button>
        </div>
      </div>
    );
  }

  const session = state.currentSession;

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          onClick={() => navigate("/session")}
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sessions
        </Button>
        <Button
          onClick={() => navigate(`/attendance/session/${session.sessionId}`)}
          className="flex items-center gap-2"
        >
          <UserCheck className="h-4 w-4" />
          Manage Attendance
        </Button>
      </div>

      {/* Session Profile Card */}
      <Card className="w-full">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                S{session.sessionId}
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">
                  {session.courseName}
                </CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {session.courseCode}
                  </span>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Session {session.sessionId}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Session Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Schedule Information
              </h3>
              <div className="space-y-2 pl-7">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDate(session.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {formatTime(session.startTime)} - {formatTime(session.endTime)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Course Details
              </h3>
              <div className="space-y-2 pl-7">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span>{session.courseName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Lecturer: {session.lecturerName}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Session Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {session.studentsAttended?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  Students Attended
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round((Date.now() - new Date(session.date).getTime()) / (1000 * 60 * 60 * 24))}
                </div>
                <div className="text-sm text-muted-foreground">
                  Days Ago
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round((new Date(`1970-01-01T${session.endTime}`) - new Date(`1970-01-01T${session.startTime}`)) / (1000 * 60))}
                </div>
                <div className="text-sm text-muted-foreground">
                  Duration (mins)
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Students Attended */}
          {session.studentsAttended && session.studentsAttended.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-xl flex items-center gap-2">
                <Users className="h-6 w-6" />
                Students Attended ({session.studentsAttended.length})
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {session.studentsAttended.map((student, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
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
                            <User className="h-3 w-3" />
                            <span>{student.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{student.phoneNumber}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 