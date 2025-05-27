import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useDepartmentContext } from "@/contexts/departmentContext";
import { CreateDepartment } from "@/types/department";
import { Loader2 } from "lucide-react";

interface DepartmentFormProps {
  setIsOpen: (open: boolean) => void;
}

function DepartmentForm({ setIsOpen }: DepartmentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateDepartment>({
    departmentName: "",
  });
  const [errors, setErrors] = useState<Partial<CreateDepartment>>({});

  const { success, error, info } = useToast(); // Using enhanced toast methods
  const { state, createDepartment } = useDepartmentContext();

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
      title: "Creating...",
      description: "Setting up new department",
      duration: 2000
    });

    try {
      await createDepartment({
        departmentName: formData.departmentName.trim(),
      });

      success({
        title: "Department Created!",
        description: `${formData.departmentName.trim()} has been successfully created`,
        duration: 4000
      });

      // Reset form and close dialog
      setFormData({ departmentName: "" });
      setIsOpen(false);
    } catch (error: any) {
      console.error("Error creating department:", error);
      error({
        title: "Creation Failed",
        description: error.response?.data?.message || state.error || "Failed to create department",
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

      {state.error && (
        <div className="text-red-500 text-sm">
          {state.error}
        </div>
      )}

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
              Creating...
            </>
          ) : (
            "Create Department"
          )}
        </Button>
      </div>
    </form>
  );
}

export default DepartmentForm;