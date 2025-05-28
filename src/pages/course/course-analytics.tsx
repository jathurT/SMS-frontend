import React, { useEffect, useState } from "react";
import { useCourseContext } from "@/contexts/courseContext";
import { CourseDetails } from "@/types/course";
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
  LineChart,
  Line,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  TrendingUp,
  BookOpen,
  GraduationCap,
  BarChartIcon,
  RefreshCw,
  Clock,
  Calendar,
  Users,
  Building,
  AlertTriangle,
  CheckCircle,
  Target,
  Award,
  TrendingDown,
} from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";

// Define chart colors
const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
];

interface CoursePerformanceMetrics {
  courseId: number;
  courseName: string;
  courseCode: string;
  enrollmentRate: number;
  sessionUtilization: number;
  performanceScore: number;
  status: 'excellent' | 'good' | 'needs-attention' | 'critical';
}

const CourseAnalytics = () => {
  const { state, fetchCourseAnalytics } = useCourseContext();
  const [performanceMetrics, setPerformanceMetrics] = useState<CoursePerformanceMetrics[]>([]);
  const [semesterData, setSemesterData] = useState<Array<{ semester: string; courses: number; students: number }>>([]);
  const [departmentData, setDepartmentData] = useState<Array<{ name: string; courses: number; avgEnrollment: number; fill: string }>>([]);

  // Chart configurations
  const semesterChartConfig = {
    courses: { label: "Courses", color: COLORS[0] },
    students: { label: "Students", color: COLORS[1] },
  } as ChartConfig;

  const departmentChartConfig = {
    courses: { label: "Courses" },
  } as ChartConfig;

  // Fetch analytics data on component mount
  useEffect(() => {
    fetchCourseAnalytics();
  }, [fetchCourseAnalytics]);

  useEffect(() => {
    if (state.analytics && state.analytics.length > 0) {
      processAnalyticsData(state.analytics);
    } else {
      setPerformanceMetrics([]);
      setSemesterData([]);
      setDepartmentData([]);
    }
  }, [state.analytics]);

  const processAnalyticsData = (analytics: CourseDetails[]) => {
    // Process performance metrics
    const metrics = analytics.map(course => {
      const enrollmentRate = course.totalStudentsEnrolled;
      const sessionUtilization = course.totalSessionsConducted;
      const performanceScore = (enrollmentRate * 0.6) + (sessionUtilization * 0.4);
      
      let status: 'excellent' | 'good' | 'needs-attention' | 'critical';
      if (performanceScore >= 15) status = 'excellent';
      else if (performanceScore >= 10) status = 'good';
      else if (performanceScore >= 5) status = 'needs-attention';
      else status = 'critical';

      return {
        courseId: course.courseId,
        courseName: course.courseName,
        courseCode: course.courseCode,
        enrollmentRate,
        sessionUtilization,
        performanceScore,
        status,
      };
    });
    setPerformanceMetrics(metrics);

    // Process semester distribution
    const semesterMap = new Map<string, { courses: number; students: number }>();
    analytics.forEach(course => {
      const existing = semesterMap.get(course.semester) || { courses: 0, students: 0 };
      semesterMap.set(course.semester, {
        courses: existing.courses + 1,
        students: existing.students + course.totalStudentsEnrolled,
      });
    });
    
    const semesterArray = Array.from(semesterMap.entries()).map(([semester, data]) => ({
      semester,
      ...data,
    }));
    setSemesterData(semesterArray);

    // Process department performance
    const departmentMap = new Map<string, { courses: number; totalStudents: number }>();
    analytics.forEach(course => {
      const existing = departmentMap.get(course.departmentName) || { courses: 0, totalStudents: 0 };
      departmentMap.set(course.departmentName, {
        courses: existing.courses + 1,
        totalStudents: existing.totalStudents + course.totalStudentsEnrolled,
      });
    });

    const departmentArray = Array.from(departmentMap.entries()).map(([name, data], index) => ({
      name: name.length > 12 ? name.substring(0, 12) + '...' : name,
      courses: data.courses,
      avgEnrollment: Math.round(data.totalStudents / data.courses),
      fill: COLORS[index % COLORS.length],
    }));
    setDepartmentData(departmentArray);
  };

  // Calculate key metrics
  const analytics = state.analytics || [];
  const totalCourses = analytics.length;
  const totalStudents = analytics.reduce((acc, course) => acc + course.totalStudentsEnrolled, 0);
  const totalSessions = analytics.reduce((acc, course) => acc + course.totalSessionsConducted, 0);
  const activeCourses = analytics.filter(course => course.totalStudentsEnrolled > 0).length;
  const underperformingCourses = performanceMetrics.filter(m => m.status === 'critical' || m.status === 'needs-attention').length;
  const avgEnrollmentPerCourse = totalCourses > 0 ? Math.round(totalStudents / totalCourses) : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'needs-attention': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <Award className="h-4 w-4" />;
      case 'good': return <CheckCircle className="h-4 w-4" />;
      case 'needs-attention': return <Target className="h-4 w-4" />;
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      default: return null;
    }
  };

  // Handle refresh analytics
  const handleRefreshAnalytics = () => {
    fetchCourseAnalytics();
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
          <BookOpen className="h-12 w-12 text-destructive mx-auto mb-4" />
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

  // Show empty state
  if (totalCourses === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Analytics Data Available</h3>
          <p className="text-muted-foreground mb-4">
            No course analytics data found. Add some courses with student enrollments to see insights.
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
          <h1 className="text-2xl font-bold tracking-tight pt-5">Course Performance Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor course effectiveness and identify improvement opportunities
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleRefreshAnalytics}
            disabled={state.analyticsLoading}
            className="flex items-center gap-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${state.analyticsLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <div className="flex items-center gap-2 bg-muted p-2 rounded-lg">
            <BarChartIcon className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">
              Performance Overview | {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Course Utilization</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCourses}/{totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((activeCourses / totalCourses) * 100)}% have active enrollments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Enrollment</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgEnrollmentPerCourse}</div>
            <p className="text-xs text-muted-foreground">
              students per course
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Session Activity</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSessions}</div>
            <p className="text-xs text-muted-foreground">
              total sessions conducted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{underperformingCourses}</div>
            <p className="text-xs text-muted-foreground">
              courses require review
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Semester Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Semester Performance</CardTitle>
            <CardDescription>Course and student distribution by semester</CardDescription>
          </CardHeader>
          <CardContent>
            {semesterData.length > 0 ? (
              <ChartContainer config={semesterChartConfig} className="h-[300px]">
                <BarChart data={semesterData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="semester" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="courses" fill={COLORS[0]} name="Courses" />
                  <Bar dataKey="students" fill={COLORS[1]} name="Students" />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No semester data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Department Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Department Overview</CardTitle>
            <CardDescription>Course distribution by department</CardDescription>
          </CardHeader>
          <CardContent>
            {departmentData.length > 0 ? (
              <ChartContainer config={departmentChartConfig} className="h-[300px]">
                <PieChart>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={departmentData}
                    dataKey="courses"
                    nameKey="name"
                    innerRadius={60}
                    strokeWidth={5}
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                              <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-2xl font-bold">
                                {departmentData.length}
                              </tspan>
                              <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 20} className="fill-muted-foreground text-sm">
                                Departments
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
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No department data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Course Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Course Performance Analysis</CardTitle>
          <CardDescription>
            Detailed performance metrics for all courses - sorted by performance score
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {performanceMetrics
              .sort((a, b) => b.performanceScore - a.performanceScore)
              .map((course, index) => (
                <div
                  key={course.courseId}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-medium text-gray-500">#{index + 1}</div>
                    <div>
                      <div className="font-semibold">{course.courseName}</div>
                      <div className="text-sm text-muted-foreground">{course.courseCode}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-lg font-bold">{course.enrollmentRate}</div>
                      <div className="text-xs text-muted-foreground">Students</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold">{course.sessionUtilization}</div>
                      <div className="text-xs text-muted-foreground">Sessions</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold">{course.performanceScore.toFixed(1)}</div>
                      <div className="text-xs text-muted-foreground">Score</div>
                    </div>
                    
                    <Badge
                      variant="outline"
                      className={`flex items-center gap-1 ${getStatusColor(course.status)}`}
                    >
                      {getStatusIcon(course.status)}
                      {course.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseAnalytics;