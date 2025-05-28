import React, { useEffect, useState } from "react";
import { useDepartmentContext } from "@/contexts/departmentContext";
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
  Building2,
  Users,
  BookOpen,
  GraduationCap,
  BarChartIcon,
  RefreshCw,
} from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Interfaces to match your API response
import { DepartmentAnalyticsData } from "@/types/department";

// Define chart colors
const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
];

const DepartmentAnalytics = () => {
  const { state, fetchDepartmentAnalytics } = useDepartmentContext();
  const [departmentData, setDepartmentData] = useState<
    Array<{ name: string; value: number; fill: string }>
  >([]);
  const [lecturerDistributionData, setLecturerDistributionData] = useState<
    Array<{ department: string; lecturers: number; courses: number }>
  >([]);

  // For charts config
  const departmentChartConfig = {
    value: { label: "Resources" },
  } as ChartConfig;

  const barChartConfig = {
    lecturers: { label: "Lecturers", color: COLORS[0] },
    courses: { label: "Courses", color: COLORS[1] },
  } as ChartConfig;

  // Fetch analytics data on component mount
  useEffect(() => {
    fetchDepartmentAnalytics();
  }, [fetchDepartmentAnalytics]);

  useEffect(() => {
    // Process data whenever analytics data changes
    if (state.analytics && state.analytics.length > 0) {
      console.log('Processing analytics data for departments:', state.analytics);
      processAnalyticsData(state.analytics);
    } else {
      // Clear data when no analytics data
      setDepartmentData([]);
      setLecturerDistributionData([]);
    }
  }, [state.analytics]);

  const processAnalyticsData = (departments: DepartmentAnalyticsData[]) => {
    console.log('Processing analytics data for', departments.length, 'departments');

    // Process department resource distribution for pie chart
    const resourceData = departments.map((dept, index) => ({
      name: dept.departmentName,
      value: dept.totalLecturers + dept.totalCourses,
      fill: COLORS[index % COLORS.length],
    }));
    
    console.log('Department resource data for pie chart:', resourceData);
    setDepartmentData(resourceData);

    // Process lecturer and course distribution for bar chart
    const distributionData = departments.map((dept) => ({
      department: dept.departmentName.length > 10 
        ? dept.departmentName.substring(0, 10) + '...' 
        : dept.departmentName,
      lecturers: dept.totalLecturers,
      courses: dept.totalCourses,
    }));
    
    console.log('Distribution data for bar chart:', distributionData);
    setLecturerDistributionData(distributionData);

    // Process semester distribution
    const semesterDistribution: Record<string, number> = {};
    departments.forEach((dept) => {
      dept.courses.forEach((course) => {
        semesterDistribution[course.semester] = (semesterDistribution[course.semester] || 0) + 1;
      });
    });    
  };

  // Calculate statistics from the analytics data
  const departments = state.analytics || [];
  const totalDepartments = departments.length;
  const totalLecturers = departments.reduce((acc, dept) => acc + dept.totalLecturers, 0);
  const totalCourses = departments.reduce((acc, dept) => acc + dept.totalCourses, 0);
  
  const averageLecturersPerDept = totalDepartments > 0 
    ? Math.round(totalLecturers / totalDepartments * 10) / 10
    : 0;
  
  const averageCoursesPerDept = totalDepartments > 0 
    ? Math.round(totalCourses / totalDepartments * 10) / 10
    : 0;

  const mostResourcefulDept = departments.length > 0 
    ? departments.reduce((max, dept) => 
        (dept.totalLecturers + dept.totalCourses) > (max.totalLecturers + max.totalCourses) ? dept : max,
        departments[0]
      )
    : null;

  // Handle refresh analytics
  const handleRefreshAnalytics = () => {
    fetchDepartmentAnalytics();
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
          <Building2 className="h-12 w-12 text-destructive mx-auto mb-4" />
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
  if (totalDepartments === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Analytics Data Available</h3>
          <p className="text-muted-foreground mb-4">
            No department analytics data found. Add some departments with lecturers and courses to see insights.
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
            Department Analytics
          </h1>
          <p className="text-muted-foreground">
            Comprehensive overview of department resources and distribution
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
                Total Departments
              </CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDepartments}</div>
              <p className="text-xs text-muted-foreground">
                Active departments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Lecturers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLecturers}</div>
              <p className="text-xs text-muted-foreground">
                Avg {averageLecturersPerDept} per department
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Courses
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCourses}</div>
              <p className="text-xs text-muted-foreground">
                Avg {averageCoursesPerDept} per department
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Most Resourceful
              </CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold truncate" title={mostResourcefulDept?.departmentName}>
                {mostResourcefulDept ? (
                  mostResourcefulDept.departmentName.length > 12 
                    ? `${mostResourcefulDept.departmentName.substring(0, 12)}...` 
                    : mostResourcefulDept.departmentName
                ) : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">
                {mostResourcefulDept ? 
                  `${mostResourcefulDept.totalLecturers + mostResourcefulDept.totalCourses} total resources` 
                  : "0 resources"
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
          {/* Department Resource Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Resource Distribution</CardTitle>
              <CardDescription>
                Total resources (lecturers + courses) by department
              </CardDescription>
            </CardHeader>
            <CardContent>
              {departmentData.length > 0 ? (
                <ChartContainer
                  config={departmentChartConfig}
                  className="mx-auto aspect-square max-h-[250px]"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={departmentData}
                      dataKey="value"
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
                                  {totalLecturers + totalCourses}
                                </tspan>
                                <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy || 0) + 24}
                                  className="fill-muted-foreground"
                                >
                                  Resources
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
                Resource allocation across departments
              </div>
              <div className="leading-none text-muted-foreground">
                Showing combined lecturers and courses
              </div>
            </CardFooter>
          </Card>

          {/* Department Comparison Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Department Comparison</CardTitle>
              <CardDescription>
                Lecturers vs Courses by department
              </CardDescription>
            </CardHeader>
            <CardContent>
              {lecturerDistributionData.length > 0 ? (
                <ChartContainer config={barChartConfig}>
                  <BarChart
                    accessibilityLayer
                    data={lecturerDistributionData}
                    margin={{
                      top: 20,
                    }}
                  >
                    <XAxis 
                      dataKey="department" 
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      angle={-45}
                      textAnchor="end"
                      height={80}
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
                      dataKey="lecturers" 
                      fill={COLORS[0]} 
                      radius={[0, 0, 4, 4]}
                      name="Lecturers"
                    />
                    <Bar 
                      dataKey="courses" 
                      fill={COLORS[1]} 
                      radius={[4, 4, 0, 0]}
                      name="Courses"
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
                Department resource comparison
              </div>
              <div className="leading-none text-muted-foreground">
                Comparing lecturer and course counts
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Additional Analytics Cards */}
      {departments.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-3">Department Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((dept) => (
              <Card key={dept.departmentId} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    {dept.departmentName}
                  </CardTitle>
                  <CardDescription>
                    Department ID: {dept.departmentId}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Lecturers</span>
                    </div>
                    <span className="font-semibold">{dept.totalLecturers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Courses</span>
                    </div>
                    <span className="font-semibold">{dept.totalCourses}</span>
                  </div>
                  {dept.lecturers.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Recent Lecturers:</p>
                      <div className="space-y-1">
                        {dept.lecturers.slice(0, 2).map((lecturer, index) => (
                          <p key={index} className="text-xs text-muted-foreground">
                            {lecturer.firstName} {lecturer.lastName}
                          </p>
                        ))}
                        {dept.lecturers.length > 2 && (
                          <p className="text-xs text-muted-foreground">
                            +{dept.lecturers.length - 2} more...
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <div className="w-full">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Total Resources</span>
                      <span className="font-semibold text-foreground">
                        {dept.totalLecturers + dept.totalCourses}
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

export default DepartmentAnalytics;