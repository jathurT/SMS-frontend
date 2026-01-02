import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    CalendarIcon,
    Users2Icon,
    TrendingUpIcon,
    BookOpenIcon,
    GraduationCapIcon,
    ClockIcon,
    RefreshCw,
    ArrowRight,
    ActivityIcon,
    UserCheck,
    CalendarDays,
} from "lucide-react";
import { useStudentContext } from "@/contexts/studentContext";
import { useLecturerContext } from "@/contexts/lecturerContext";
import { useCourseContext } from "@/contexts/courseContext";
import { useSessionContext } from "@/contexts/sessionContext";
import { useAttendanceContext } from "@/contexts/attendanceContext";
import { useAuth } from "@/contexts/authContext";
import { useNavigate } from "react-router-dom";
import Lorder from "@/components/Lorder";

const Dashboard = () => {
    const [currentMonth, setCurrentMonth] = useState<string>("");
    const [isRefreshing, setIsRefreshing] = useState(false);

    const { user, hasRole } = useAuth();
    const navigate = useNavigate();

    // Get all contexts
    const { state: studentState, fetchStudents } = useStudentContext();
    const { state: lecturerState, fetchLecturers } = useLecturerContext();
    const { state: courseState, fetchCourses } = useCourseContext();
    const { state: sessionState, fetchSessions } = useSessionContext();
    const { state: attendanceState } = useAttendanceContext();

    useEffect(() => {
        // Set current month
        const now = new Date();
        const monthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });
        setCurrentMonth(monthName);

        // Fetch all data
        const loadDashboardData = async () => {
            try {
                await Promise.all([
                    fetchStudents(),
                    fetchLecturers(),
                    fetchCourses(),
                    fetchSessions(),
                ]);
            } catch (error) {
                console.error("Error loading dashboard data:", error);
            }
        };

        loadDashboardData();
    }, []);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await Promise.all([
                fetchStudents(),
                fetchLecturers(),
                fetchCourses(),
                fetchSessions(),
            ]);
        } catch (error) {
            console.error("Failed to refresh dashboard", error);
        } finally {
            setIsRefreshing(false);
        }
    };

    // Calculate statistics
    const totalStudents = studentState.students.length;
    const totalLecturers = lecturerState.lecturers.length;
    const totalCourses = courseState.courses.length;
    const totalSessions = sessionState.sessions.length;

    // Get today's sessions
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySessions = sessionState.sessions.filter(session => {
        const sessionDate = new Date(session.date);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate.getTime() === today.getTime();
    });

    // Get upcoming sessions (next 7 days)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const upcomingSessions = sessionState.sessions.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate > today && sessionDate <= nextWeek;
    });

    // Show loading state
    const isLoading = studentState.loading || lecturerState.loading ||
                      courseState.loading || sessionState.loading;

    if (isLoading && totalStudents === 0) {
        return (
            <div className="flex w-full h-screen justify-center items-center">
                <Lorder />
            </div>
        );
    }

    // Get greeting based on time of day
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <div className="min-h-screen p-4 md:p-6 space-y-6 bg-background">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {getGreeting()}, {user?.firstName || 'User'}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Here's what's happening in your Student Management System
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Badge
                        variant="outline"
                        className="bg-primary/10 text-primary flex gap-2 py-1.5 px-3"
                    >
                        <CalendarIcon size={16} />
                        <span>{currentMonth}</span>
                    </Badge>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card
                    className="overflow-hidden border-l-4 border-l-blue-500 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => hasRole("ADMIN") || hasRole("LECTURER") ? navigate("/student") : null}
                >
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">
                                    Total Students
                                </p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-3xl font-bold">{totalStudents}</p>
                                    <span className="text-sm text-green-600">
                                        Active
                                    </span>
                                </div>
                            </div>
                            <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-full">
                                <GraduationCapIcon className="h-5 w-5 text-blue-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card
                    className="overflow-hidden border-l-4 border-l-purple-500 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => hasRole("ADMIN") ? navigate("/lecturer") : null}
                >
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">
                                    Total Lecturers
                                </p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-3xl font-bold">{totalLecturers}</p>
                                    <span className="text-sm text-purple-600">
                                        Faculty
                                    </span>
                                </div>
                            </div>
                            <div className="bg-purple-100 dark:bg-purple-900/20 p-2 rounded-full">
                                <Users2Icon className="h-5 w-5 text-purple-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card
                    className="overflow-hidden border-l-4 border-l-green-500 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => (hasRole("ADMIN") || hasRole("LECTURER")) ? navigate("/course") : null}
                >
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">
                                    Total Courses
                                </p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-3xl font-bold">{totalCourses}</p>
                                    <span className="text-sm text-green-600">
                                        Offered
                                    </span>
                                </div>
                            </div>
                            <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full">
                                <BookOpenIcon className="h-5 w-5 text-green-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card
                    className="overflow-hidden border-l-4 border-l-amber-500 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => (hasRole("ADMIN") || hasRole("LECTURER")) ? navigate("/session") : null}
                >
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">
                                    Today's Sessions
                                </p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-3xl font-bold">{todaySessions.length}</p>
                                    <span className="text-sm text-amber-600">
                                        Scheduled
                                    </span>
                                </div>
                            </div>
                            <div className="bg-amber-100 dark:bg-amber-900/20 p-2 rounded-full">
                                <ClockIcon className="h-5 w-5 text-amber-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions & Today's Schedule */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <TrendingUpIcon className="h-5 w-5" />
                            Quick Actions
                        </CardTitle>
                        <CardDescription>
                            Frequently used actions and shortcuts
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-3">
                            {(hasRole("ADMIN") || hasRole("LECTURER")) && (
                                <Button
                                    variant="outline"
                                    className="justify-start h-auto py-3"
                                    onClick={() => navigate("/student")}
                                >
                                    <div className="flex items-center gap-3 w-full">
                                        <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-lg">
                                            <GraduationCapIcon className="h-5 w-5 text-blue-500" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <h3 className="font-semibold">Manage Students</h3>
                                            <p className="text-sm text-muted-foreground">
                                                View and manage student records
                                            </p>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </Button>
                            )}

                            {(hasRole("ADMIN") || hasRole("LECTURER")) && (
                                <Button
                                    variant="outline"
                                    className="justify-start h-auto py-3"
                                    onClick={() => navigate("/course")}
                                >
                                    <div className="flex items-center gap-3 w-full">
                                        <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-lg">
                                            <BookOpenIcon className="h-5 w-5 text-green-500" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <h3 className="font-semibold">Manage Courses</h3>
                                            <p className="text-sm text-muted-foreground">
                                                View and manage course offerings
                                            </p>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </Button>
                            )}

                            <Button
                                variant="outline"
                                className="justify-start h-auto py-3"
                                onClick={() => navigate("/attendance")}
                            >
                                <div className="flex items-center gap-3 w-full">
                                    <div className="bg-purple-100 dark:bg-purple-900/20 p-2 rounded-lg">
                                        <UserCheck className="h-5 w-5 text-purple-500" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <h3 className="font-semibold">View Attendance</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Track and manage attendance records
                                        </p>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                </div>
                            </Button>

                            <Button
                                variant="outline"
                                className="justify-start h-auto py-3"
                                onClick={() => navigate("/enrollment")}
                            >
                                <div className="flex items-center gap-3 w-full">
                                    <div className="bg-amber-100 dark:bg-amber-900/20 p-2 rounded-lg">
                                        <ActivityIcon className="h-5 w-5 text-amber-500" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <h3 className="font-semibold">Manage Enrollments</h3>
                                        <p className="text-sm text-muted-foreground">
                                            View and manage course enrollments
                                        </p>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                </div>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Today's Schedule / Upcoming Sessions */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <CalendarDays className="h-5 w-5" />
                            Upcoming Sessions
                        </CardTitle>
                        <CardDescription>
                            Sessions scheduled for the next 7 days
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {upcomingSessions.length > 0 ? (
                            <div className="space-y-3 max-h-[300px] overflow-y-auto">
                                {upcomingSessions.slice(0, 5).map((session) => (
                                    <div
                                        key={session.sessionId}
                                        className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                                        onClick={() => navigate(`/session/${session.sessionId}`)}
                                    >
                                        <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-full mt-0.5">
                                            <ClockIcon className="h-4 w-4 text-blue-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">
                                                Session #{session.sessionId}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(session.date).toLocaleDateString()} • {session.startTime} - {session.endTime}
                                            </p>
                                        </div>
                                        <Badge variant="outline" className="shrink-0">
                                            {new Date(session.date).toLocaleDateString() === today.toLocaleDateString()
                                                ? "Today"
                                                : new Date(session.date).toLocaleDateString('en-US', { weekday: 'short' })
                                            }
                                        </Badge>
                                    </div>
                                ))}
                                {upcomingSessions.length > 5 && (
                                    <Button
                                        variant="ghost"
                                        className="w-full"
                                        onClick={() => navigate("/session")}
                                    >
                                        View All Sessions ({upcomingSessions.length})
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                                <p className="text-sm text-muted-foreground">
                                    No upcoming sessions in the next 7 days
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* System Overview */}
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">System Overview</CardTitle>
                    <CardDescription>
                        Current statistics and system health
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">{totalStudents}</div>
                            <div className="text-sm text-muted-foreground mt-1">Students Enrolled</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600">{totalLecturers}</div>
                            <div className="text-sm text-muted-foreground mt-1">Faculty Members</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">{totalCourses}</div>
                            <div className="text-sm text-muted-foreground mt-1">Active Courses</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-amber-600">{totalSessions}</div>
                            <div className="text-sm text-muted-foreground mt-1">Total Sessions</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Dashboard;
