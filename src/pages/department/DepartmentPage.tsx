import { useDepartmentContext } from "@/contexts/departmentContext";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import DepartmentForm from "@/components/forms/department-form";
import DepartmentAnalytics from "./department-analytics";
import { useState } from "react";
import Lorder from "@/components/Lorder";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";

export default function DepartmentPage() {
  const { state, fetchDepartments } = useDepartmentContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchDepartments();
    } catch (error) {
      console.error("Failed to refresh departments", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Only show loading spinner on initial load
  if (state.loading && state.departments.length === 0) {
    return (
      <div className="flex w-full h-screen justify-center items-center">
        <Lorder />
      </div>
    );
  }

  // Show error only for critical errors (not "no data found" type errors)
  const isCriticalError = state.error && 
    !state.error.toLowerCase().includes('no departments found') &&
    !state.error.toLowerCase().includes('not found') &&
    state.departments.length === 0;

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
      {/* Add Department Dialog */}
      <ResponsiveDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Add Department"
        className="sm:max-w-screen-md p-20"
      >
        <DepartmentForm setIsOpen={setIsOpen} />
      </ResponsiveDialog>

      <div className="pb-5 px-2 lg:px-0">
          <Tabs defaultValue="list">
          <TabsList className="">
            <TabsTrigger value="list">
              Department List ({state.departments.length})
            </TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="list">
            <DataTable 
              columns={columns} 
              data={state.departments || []}  
            />
          </TabsContent>
          <TabsContent value="analytics">
            <DepartmentAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}