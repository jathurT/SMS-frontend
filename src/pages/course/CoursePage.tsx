import { useCourseContext } from "@/contexts/courseContext";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import CourseForm from "@/components/forms/course-form";
import CourseAnalytics from "./course-analytics";
import { useState } from "react";
import Lorder from "@/components/Lorder";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";

export default function CoursePage() {
  const { state, fetchCourses } = useCourseContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchCourses();
    } catch (error) {
      console.error("Failed to refresh courses", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Only show loading spinner on initial load
  if (state.loading && state.courses.length === 0) {
    return (
      <div className="flex w-full h-screen justify-center items-center">
        <Lorder />
      </div>
    );
  }

  // Show error only for critical errors (not "no data found" type errors)
  const isCriticalError = state.error && 
    !state.error.toLowerCase().includes('no courses found') &&
    !state.error.toLowerCase().includes('not found') &&
    state.courses.length === 0;

  if (isCriticalError) {
    return (
      <div className="flex w-full h-screen justify-center items-center">
        <div className="text-center space-y-4">
          <div className="text-red-500">Error: {state.error}</div>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Add Course Dialog */}
      <ResponsiveDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Add Course"
        className="sm:max-w-screen-md p-20"
      >
        <CourseForm setIsOpen={setIsOpen} />
      </ResponsiveDialog>

      <div className="pb-5 px-2 lg:px-0">
          <Tabs defaultValue="list">
          <TabsList className="">
            <TabsTrigger value="list">
              Course List ({state.courses.length})
            </TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="list">
            <DataTable 
              columns={columns} 
              data={state.courses || []}  
            />
          </TabsContent>
          <TabsContent value="analytics">
            <CourseAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}