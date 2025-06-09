import React, { useEffect, useState } from "react";
import { useStudentContext } from "@/contexts/studentContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Label,
  XAxis,
  YAxis,
} from "recharts";
import {
  TrendingUp,
  Users,
  BookOpen,
  GraduationCap,
  BarChartIcon,
  RefreshCw,
  Clock,
  Calendar,
} from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Interfaces for student analytics
export interface StudentAnalyticsData {
  studentId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
  courses: Array<{
    courseId: number;
    courseName: string;
    courseCode: string;
    semester: string;
  }>;
  totalCoursesEnrolled: number;
  sessionsAttended: Array<{
    sessionId: number;
    date: string;
    startTime: string;
    endTime: string;
    courseName: string;
    courseCode: string;
    lecturerName: string;
  }>;
  totalSessionsAttended: number;
}

// Define chart colors
const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
];

const StudentAnalytics = () => {
  const { state, fetchStudentAnalytics } = useStudentContext();
  const [courseEnrollmentData, setCourseEnrollmentData] = useState<
    Array<{ name: string; value: number; fill: string }>
  >([]);
  const [attendanceDistributionData, setAttendanceDistributionData] = useState<
    Array<{ range: string; students: number; attendance: number }>
  >([]);

  // For charts config
  const courseChartConfig = {
    value: { label: "Students" },
  } as ChartConfig;

  const barChartConfig = {
    students: { label: "Students", color: COLORS[0] },
    attendance: { label: "Avg Attendance", color: COLORS[1] },
  } as ChartConfig;

  // Fetch analytics data on component mount
  useEffect(() => {
    fetchStudentAnalytics();
  }, [fetchStudentAnalytics]);

  useEffect(() => {
    // Process data whenever analytics data changes
    if (state.analytics && state.analytics.length > 0) {
      console.log('Processing analytics data for students:', state.analytics);
      processAnalyticsData(state.analytics);
    } else {
      // Clear data when no analytics data
      setCourseEnrollmentData([]);
      setAttendanceDistributionData([]);
    }
  }, [state.analytics]);

  const processAnalyticsData = (students: StudentAnalyticsData[]) => {
    console.log('Processing analytics data for', students.length, 'students');

    // Process course enrollment distribution for pie chart
    const courseEnrollment: Record<string, number> = {};
    students.forEach((student) => {
      student.courses.forEach((course) => {
        courseEnrollment[course.courseName] = (courseEnrollment[course.courseName] || 0) + 1;
      });
    });

    const enrollmentData = Object.entries(courseEnrollment)
      .map(([courseName, count], index) => ({
        name: courseName.length > 20 ? courseName.substring(0, 20) + '...' : courseName,
        value: count,
        fill: COLORS[index % COLORS.length],
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6); // Top 6 courses
    
    console.log('Course enrollment data for pie chart:', enrollmentData);
    setCourseEnrollmentData(enrollmentData);

    // Process attendance distribution for bar chart
    const attendanceRanges = [
      { range: '0-2', min: 0, max: 2 },
      { range: '3-5', min: 3, max: 5 },
      { range: '6-10', min: 6, max: 10 },
      { range: '11-15', min: 11, max: 15 },
      { range: '16+', min: 16, max: Infinity },
    ];

    const distributionData = attendanceRanges.map((range) => {
      const studentsInRange = students.filter((student) => 
        student.totalSessionsAttended >= range.min && 
        student.totalSessionsAttended <= range.max
      );
      
      const avgAttendance = studentsInRange.length > 0
        ? Math.round(studentsInRange.reduce((sum, student) => sum + student.totalSessionsAttended, 0) / studentsInRange.length * 10) / 10
        : 0;

      return {
        range: range.range,
        students: studentsInRange.length,
        attendance: avgAttendance,
      };
    });
    
    console.log('Attendance distribution data for bar chart:', distributionData);
    setAttendanceDistributionData(distributionData);
  };

  // Calculate statistics from the analytics data
  const students = state.analytics || [];
  const totalStudents = students.length;
  const totalEnrollments = students.reduce((acc, student) => acc + student.totalCoursesEnrolled, 0);
  const totalAttendance = students.reduce((acc, student) => acc + student.totalSessionsAttended, 0);
  
  const averageEnrollmentsPerStudent = totalStudents > 0 
    ? Math.round(totalEnrollments / totalStudents * 10) / 10
    : 0;
  
  const averageAttendancePerStudent = totalStudents > 0 
    ? Math.round(totalAttendance / totalStudents * 10) / 10
    : 0;

  const mostActiveStudent = students.length > 0 
    ? students.reduce((max, student) => 
        student.totalSessionsAttended > max.totalSessionsAttended ? student : max,
        students[0]
      )
    : null;

  // Handle refresh analytics
  const handleRefreshAnalytics = () => {
    fetchStudentAnalytics();
  };

  // Show loading state
  if (state.analyticsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading analytics data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (state.analyticsError) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Users className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2 text-destructive">Error Loading Analytics</h3>
          <p className="text-muted-foreground mb-4">{state.analyticsError}</p>
          <button 
            onClick={handleRefreshAnalytics} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show empty state if no analytics data
  if (totalStudents === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Analytics Data Available</h3>
          <p className="text-muted-foreground mb-4">
            No student analytics data found. Add some students with course enrollments to see insights.
          </p>
          <button 
            onClick={handleRefreshAnalytics} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Analytics
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Dashboard Header */}
      <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:items-center md:justify-between pb-4 border-b">
        <div className="pl-1">
          <h1 className="text-2xl font-bold tracking-tight pt-5">
            Student Analytics
          </h1>
          <p className="text-muted-foreground">
            Comprehensive overview of student enrollments and attendance
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleRefreshAnalytics}
            disabled={state.analyticsLoading}
            className="flex items-center gap-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${state.analyticsLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <div className="flex items-center gap-2 bg-muted p-2 rounded-lg">
            <BarChartIcon className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">
              Dashboard | Last Updated: {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Summary Cards Section */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Summary Cards */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                Active students
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Enrollments
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEnrollments}</div>
              <p className="text-xs text-muted-foreground">
                Avg {averageEnrollmentsPerStudent} per student
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Attendance
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAttendance}</div>
              <p className="text-xs text-muted-foreground">
                Avg {averageAttendancePerStudent} per student
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Most Active
              </CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold truncate" title={mostActiveStudent ? `${mostActiveStudent.firstName} ${mostActiveStudent.lastName}` : ''}>
                {mostActiveStudent ? (
                  `${mostActiveStudent.firstName} ${mostActiveStudent.lastName}`.length > 12 
                    ? `${mostActiveStudent.firstName} ${mostActiveStudent.lastName}`.substring(0, 12) + '...' 
                    : `${mostActiveStudent.firstName} ${mostActiveStudent.lastName}`
                ) : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">
                {mostActiveStudent ? 
                  `${mostActiveStudent.totalSessionsAttended} sessions attended` 
                  : "0 sessions"
                }
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Charts Section */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Analytics Overview</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Course Enrollment Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Course Popularity</CardTitle>
              <CardDescription>
                Most enrolled courses by student count
              </CardDescription>
            </CardHeader>
            <CardContent>
              {courseEnrollmentData.length > 0 ? (
                <ChartContainer
                  config={courseChartConfig}
                  className="mx-auto aspect-square max-h-[250px]"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={courseEnrollmentData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      strokeWidth={5}
                    >
                      {courseEnrollmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                              <text
                                x={viewBox.cx}
                                y={viewBox.cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                              >
                                <tspan
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  className="fill-foreground text-3xl font-bold"
                                >
                                  {totalEnrollments}
                                </tspan>
                                <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy || 0) + 24}
                                  className="fill-muted-foreground"
                                >
                                  Enrollments
                                </tspan>
                              </text>
                            );
                          }
                          return null;
                        }}
                      />
                    </Pie>
                  </PieChart>
                </ChartContainer>
              ) : (
                <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                  No data to display
                </div>
              )}
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
              <div className="flex items-center gap-2 font-medium leading-none">
                <TrendingUp className="h-4 w-4" />
                Course enrollment distribution
              </div>
              <div className="leading-none text-muted-foreground">
                Showing top enrolled courses
              </div>
            </CardFooter>
          </Card>

          {/* Attendance Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Attendance Distribution</CardTitle>
              <CardDescription>
                Student distribution by session attendance ranges
              </CardDescription>
            </CardHeader>
            <CardContent>
              {attendanceDistributionData.length > 0 ? (
                <ChartContainer config={barChartConfig}>
                  <BarChart
                    accessibilityLayer
                    data={attendanceDistributionData}
                    margin={{
                      top: 20,
                    }}
                  >
                    <XAxis 
                      dataKey="range" 
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent />}
                    />
                    <Bar 
                      dataKey="students" 
                      fill={COLORS[0]} 
                      radius={[0, 0, 4, 4]}
                      name="Students"
                    />
                    <Bar 
                      dataKey="attendance" 
                      fill={COLORS[1]} 
                      radius={[4, 4, 0, 0]}
                      name="Avg Attendance"
                    />
                  </BarChart>
                </ChartContainer>
              ) : (
                <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                  No data to display
                </div>
              )}
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 font-medium leading-none">
                Student attendance patterns
              </div>
              <div className="leading-none text-muted-foreground">
                Grouped by session attendance ranges
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Student Details Cards */}
      {students.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-3">Top Performing Students</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students
              .sort((a, b) => b.totalSessionsAttended - a.totalSessionsAttended)
              .slice(0, 6)
              .map((student) => (
              <Card key={student.studentId} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    {student.firstName} {student.lastName}
                  </CardTitle>
                  <CardDescription>
                    Student ID: {student.studentId}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Courses</span>
                    </div>
                    <span className="font-semibold">{student.totalCoursesEnrolled}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Attendance</span>
                    </div>
                    <span className="font-semibold">{student.totalSessionsAttended}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Age</span>
                    </div>
                    <span className="font-semibold">
                      {new Date().getFullYear() - new Date(student.dateOfBirth).getFullYear()}
                    </span>
                  </div>
                  {student.courses.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Recent Courses:</p>
                      <div className="space-y-1">
                        {student.courses.slice(0, 2).map((course, index) => (
                          <p key={index} className="text-xs text-muted-foreground">
                            {course.courseCode} - {course.courseName}
                          </p>
                        ))}
                        {student.courses.length > 2 && (
                          <p className="text-xs text-muted-foreground">
                            +{student.courses.length - 2} more courses...
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <div className="w-full">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Engagement Score</span>
                      <span className="font-semibold text-foreground">
                        {student.totalCoursesEnrolled + student.totalSessionsAttended}
                      </span>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAnalytics;