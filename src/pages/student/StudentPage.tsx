import { useStudentContext } from "@/contexts/studentContext";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import StudentForm from "@/components/forms/student-form";
// import StudentAnalytics from "./student-analytics";
import { useState } from "react";
import Lorder from "@/components/Lorder";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import StudentAnalytics from "./student-analytics";

export default function StudentPage() {
  const { state, fetchStudents } = useStudentContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchStudents();
    } catch (error) {
      console.error("Failed to refresh students", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Only show loading spinner on initial load
  if (state.loading && state.students.length === 0) {
    return (
      <div className="flex w-full h-screen justify-center items-center">
        <Lorder />
      </div>
    );
  }

  // Show error only for critical errors (not "no data found" type errors)
  const isCriticalError = state.error && 
    !state.error.toLowerCase().includes('no students found') &&
    !state.error.toLowerCase().includes('not found') &&
    state.students.length === 0;

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
      {/* Add Student Dialog */}
      <ResponsiveDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Add Student"
        className="sm:max-w-screen-md p-20"
      >
        <StudentForm setIsOpen={setIsOpen} />
      </ResponsiveDialog>

      <div className="pb-5 px-2 lg:px-0">
          <Tabs defaultValue="list">
          <TabsList className="">
            <TabsTrigger value="list">
              Student List ({state.students.length})
            </TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="list">
            <DataTable 
              columns={columns} 
              data={state.students || []}  
            />
          </TabsContent>
          <TabsContent value="analytics">
            <StudentAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}