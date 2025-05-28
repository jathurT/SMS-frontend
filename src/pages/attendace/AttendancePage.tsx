import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAttendanceContext } from "@/contexts/attendanceContext";
import { useDepartmentContext } from "@/contexts/departmentContext";
import { useCourseContext } from "@/contexts/courseContext";
import { useSessionContext } from "@/contexts/sessionContext";
import Lorder from "@/components/Lorder";
import {
    Building2,
    BookOpen,
    Users,
    ArrowLeft,
    Clock,
    Calendar,
    Hash,
    UserCheck,
    UserX,
    CheckSquare,
    AlertCircle
} from "lucide-react";
import { Department } from "@/types/department";
import { Course } from "@/types/course";
import { Session } from "@/types/session";
import { useToast } from "@/hooks/use-toast";

export default function AttendancePage() {
    const { state: attendanceState, fetchAttendancesBySession, fetchNonAttendingStudents, addAttendance, deleteAttendance, clearData } = useAttendanceContext();
    const { state: departmentState, fetchDepartments } = useDepartmentContext();
    const { state: courseState, fetchCoursesByDepartment, clearCourses } = useCourseContext();
    const { state: sessionState, fetchSessionsByCourse, clearSessions } = useSessionContext();
    const { toast } = useToast();

    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);

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
        setSelectedSession(null);
        clearData();
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
        setSelectedSession(null);
        clearData();

        try {
            await fetchSessionsByCourse(course.courseId);
        } catch (error) {
            console.error("Error fetching sessions:", error);
        }
    };

    // Session Selection Handler
    const handleSessionSelect = async (session: Session) => {
        setSelectedSession(session);

        try {
            await Promise.all([
                fetchAttendancesBySession(session.sessionId),
                fetchNonAttendingStudents(session.sessionId)
            ]);
        } catch (error) {
            console.error("Error fetching attendance data:", error);
        }
    };

    // Back Navigation Handlers
    const handleBackToDepartments = () => {
        setSelectedDepartment(null);
        setSelectedCourse(null);
        setSelectedSession(null);
        clearCourses();
        clearSessions();
        clearData();
    };

    const handleBackToCourses = () => {
        setSelectedCourse(null);
        setSelectedSession(null);
        clearSessions();
        clearData();
    };

    const handleBackToSessions = () => {
        setSelectedSession(null);
        clearData();
    };

    // Add Attendance Handler
    const handleAddAttendance = async (studentId: number) => {
        if (!selectedSession) return;

        try {
            await addAttendance(selectedSession.sessionId, studentId);
            toast({
                title: "Success",
                description: "Attendance added successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add attendance",
                variant: "destructive",
            });
        }
    };

    // Remove Attendance Handler
    const handleRemoveAttendance = async (studentId: number) => {
        if (!selectedSession) return;

        try {
            await deleteAttendance(selectedSession.sessionId, studentId);
            toast({
                title: "Success",
                description: "Attendance removed successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to remove attendance",
                variant: "destructive",
            });
        }
    };

    // Utility Functions
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
                        <CheckSquare className="h-8 w-8" />
                        Attendance Management
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Select a department to view and manage attendance
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
                        Select a course to view sessions and manage attendance
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
                                            <Clock className="h-4 w-4 text-muted-foreground" />
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

    // Session Selection View
    if (selectedDepartment && selectedCourse && !selectedSession) {
        return (
            <div className="container mx-auto py-6 px-4">
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

                    <div className="flex items-center gap-3 mb-2">
                        <Clock className="h-6 w-6 text-purple-600" />
                        <h1 className="text-3xl font-bold">Course Sessions</h1>
                    </div>
                    <p className="text-muted-foreground">
                        Select a session to manage attendance for {selectedCourse.courseCode} - {selectedCourse.courseName}
                    </p>
                </div>

                {sessionState.loading ? (
                    <div className="flex justify-center items-center py-12">
                        <Lorder />
                    </div>
                ) : sessionState.error ? (
                    <Card className="p-8">
                        <div className="text-center text-red-500">
                            Error: {sessionState.error}
                        </div>
                    </Card>
                ) : sessionState.sessions.length === 0 ? (
                    <Card className="p-8">
                        <div className="text-center text-muted-foreground">
                            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>No sessions found for this course</p>
                        </div>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sessionState.sessions.map((session) => (
                            <Card
                                key={session.sessionId}
                                className="hover:shadow-lg transition-shadow cursor-pointer group"
                                onClick={() => handleSessionSelect(session)}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <Clock className="h-8 w-8 text-purple-600 group-hover:text-purple-700" />
                                        <Badge variant="secondary">
                                            Session {session.sessionId}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <CardTitle className="text-lg group-hover:text-purple-600 transition-colors">
                                        {session.courseName}
                                    </CardTitle>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span>{formatDate(session.date)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <span>{formatTime(session.startTime)} - {formatTime(session.endTime)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            <span>{session.lecturerName}</span>
                                        </div>
                                    </div>

                                    <p className="text-xs text-muted-foreground">
                                        Click to manage attendance
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // Attendance Management View
    if (selectedDepartment && selectedCourse && selectedSession) {
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
                        <Button
                            onClick={handleBackToSessions}
                            variant="ghost"
                            size="sm"
                        >
                            <Clock className="h-4 w-4 mr-1" />
                            Sessions
                        </Button>
                        <span>/</span>
                        <span className="font-medium">Attendance</span>
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <CheckSquare className="h-8 w-8" />
                            Session Attendance
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Manage attendance for {selectedSession.courseCode} - Session {selectedSession.sessionId}
                        </p>
                    </div>
                </div>

                {/* Session Information Card */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Session Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Course</p>
                                <p className="text-lg font-semibold">{selectedSession.courseCode}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Date</p>
                                <p className="text-lg font-semibold">{formatDate(selectedSession.date)}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Time</p>
                                <p className="text-lg font-semibold">
                                    {formatTime(selectedSession.startTime)} - {formatTime(selectedSession.endTime)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Lecturer</p>
                                <p className="text-lg font-semibold">
                                    {selectedSession.lecturerName}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Separator className="mb-6" />

                {/* Attendance Management */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Attending Students */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <UserCheck className="h-5 w-5 text-green-600" />
                                    Attending Students ({attendanceState.attendances.length})
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {attendanceState.loading ? (
                                <div className="flex justify-center items-center py-8">
                                    <Lorder />
                                </div>
                            ) : attendanceState.error ? (
                                <div className="text-center text-red-500 py-8">
                                    <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                                    <p>Error: {attendanceState.error}</p>
                                </div>
                            ) : attendanceState.attendances.length === 0 ? (
                                <div className="text-center text-muted-foreground py-8">
                                    <UserCheck className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p>No students have attended yet</p>
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                    {attendanceState.attendances.map((attendance) => (
                                        <div
                                            key={`${attendance.sessionId}-${attendance.studentId}`}
                                            className="flex items-center justify-between p-3 border rounded-lg"
                                        >
                                            <div>
                                                <p className="font-medium">{attendance.studentName}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Student ID: {attendance.studentId}
                                                </p>
                                            </div>
                                            <Button
                                                onClick={() => handleRemoveAttendance(attendance.studentId)}
                                                variant="outline"
                                                size="sm"
                                                className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                                                disabled={attendanceState.deleting}
                                            >
                                                <UserX className="h-4 w-4 mr-1" />
                                                Remove
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Non-Attending Students */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <UserX className="h-5 w-5 text-orange-600" />
                                    Non-Attending Students ({attendanceState.nonAttendingStudents.length})
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {attendanceState.loading ? (
                                <div className="flex justify-center items-center py-8">
                                    <Lorder />
                                </div>
                            ) : attendanceState.error ? (
                                <div className="text-center text-red-500 py-8">
                                    <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                                    <p>Error: {attendanceState.error}</p>
                                </div>
                            ) : attendanceState.nonAttendingStudents.length === 0 ? (
                                <div className="text-center text-muted-foreground py-8">
                                    <UserCheck className="h-8 w-8 mx-auto mb-2 opacity-50 text-green-600" />
                                    <p>All enrolled students are attending!</p>
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                    {attendanceState.nonAttendingStudents.map((student) => (
                                        <div
                                            key={student.studentId}
                                            className="flex items-center justify-between p-3 border rounded-lg"
                                        >
                                            <div>
                                                <p className="font-medium">{student.firstName}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Student ID: {student.studentId}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {student.email}
                                                </p>
                                            </div>
                                            <Button
                                                onClick={() => handleAddAttendance(student.studentId)}
                                                variant="outline"
                                                size="sm"
                                                className="text-green-600 hover:text-green-700 border-green-200 hover:border-green-300"
                                                disabled={attendanceState.creating}
                                            >
                                                <UserCheck className="h-4 w-4 mr-1" />
                                                Mark Present
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Summary Statistics */}
                <div className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Attendance Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">
                                        {attendanceState.attendances.length}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Present</div>
                                </div>
                                <div className="text-center p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                                    <div className="text-2xl font-bold text-orange-600">
                                        {attendanceState.nonAttendingStudents.length}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Absent</div>
                                </div>
                                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {Math.round((attendanceState.attendances.length / (attendanceState.attendances.length + attendanceState.nonAttendingStudents.length)) * 100) || 0}%
                                    </div>
                                    <div className="text-sm text-muted-foreground">Attendance Rate</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return null;
}