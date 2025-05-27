import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useDepartmentContext } from "@/contexts/departmentContext";
import { CreateDepartment } from "@/types/department";
import { Loader2 } from "lucide-react";

interface DepartmentEditFormProps {
  departmentId: number;
  setIsOpen: (open: boolean) => void;
}

function DepartmentEditForm({ 
  departmentId, 
  setIsOpen 
}: DepartmentEditFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateDepartment>({
    departmentName: "",
  });
  const [errors, setErrors] = useState<Partial<CreateDepartment>>({});
  const [isLoadingData, setIsLoadingData] = useState(true);

  const { success, error, info } = useToast(); // Using enhanced toast methods
  const { state, updateDepartment, fetchDepartmentById } = useDepartmentContext();

  // Load existing department data
  useEffect(() => {
    const loadDepartment = async () => {
      try {
        setIsLoadingData(true);
        
        // First check if department exists in current state
        const existingDepartment = state.departments.find(
          dept => dept.departmentId === departmentId
        );
        
        if (existingDepartment) {
          setFormData({
            departmentName: existingDepartment.departmentName,
          });
        } else {
          // Fetch from API if not in current state
          const department = await fetchDepartmentById(departmentId);
          setFormData({
            departmentName: department.departmentName,
          });
        }
      } catch (err) {
        console.error("Error loading department:", err);
        error({
          title: "Loading Failed",
          description: "Failed to load department data",
          duration: 5000
        });
        setIsOpen(false);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadDepartment();
  }, [departmentId, state.departments, fetchDepartmentById, setIsOpen, error]);

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateDepartment> = {};

    if (!formData.departmentName.trim()) {
      newErrors.departmentName = "Department name is required";
    } else if (formData.departmentName.trim().length < 2) {
      newErrors.departmentName = "Department name must be at least 2 characters";
    } else if (formData.departmentName.trim().length > 100) {
      newErrors.departmentName = "Department name must be less than 100 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    // Show processing toast
    info({
      title: "Processing...",
      description: "Updating department information",
      duration: 2000
    });

    try {
      await updateDepartment(departmentId, {
        departmentName: formData.departmentName.trim(),
      });

      success({
        title: "Updated Successfully!",
        description: "Department information has been updated",
        duration: 4000
      });

      setIsOpen(false);
    } catch (err: unknown) {
      console.error("Error updating department:", err);
      const errorMessage = err instanceof Error && 'response' in err && 
        typeof err.response === 'object' && 
        err.response !== null && 
        'data' in err.response && 
        typeof err.response.data === 'object' && 
        err.response.data !== null && 
        'message' in err.response.data && 
        typeof err.response.data.message === 'string'
        ? err.response.data.message
        : state.error || "Failed to update department";
      
      error({
        title: "Update Failed",
        description: errorMessage,
        duration: 6000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateDepartment, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading department data...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="departmentName">
            Department Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="departmentName"
            type="text"
            placeholder="Enter department name"
            value={formData.departmentName}
            onChange={(e) => handleInputChange("departmentName", e.target.value)}
            className={errors.departmentName ? "border-red-500" : ""}
            disabled={isLoading || state.loading}
            maxLength={100}
          />
          {errors.departmentName && (
            <p className="text-sm text-red-500">{errors.departmentName}</p>
          )}
          <p className="text-xs text-muted-foreground">
            {formData.departmentName.length}/100 characters
          </p>
        </div>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsOpen(false)}
          disabled={isLoading || state.loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || state.loading}>
          {isLoading || state.loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Department"
          )}
        </Button>
      </div>
    </form>
  );
}

export default DepartmentEditForm;
