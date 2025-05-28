import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLecturerContext } from "@/contexts/lecturerContext";
import { useDepartmentContext } from "@/contexts/departmentContext";
import { CreateLecturer } from "@/types/lecturer";
import { Loader2 } from "lucide-react";

interface LecturerFormProps {
  setIsOpen: (open: boolean) => void;
}

// Define a proper error type that allows string messages for each field
type FormErrors = {
  [K in keyof CreateLecturer]?: string;
};

function LecturerForm({ setIsOpen }: LecturerFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateLecturer>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    departmentId: 0,
    address: "",
    dateOfBirth: new Date(),
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const { success, error, info } = useToast();
  const { state, createLecturer } = useLecturerContext();
  const { state: departmentState } = useDepartmentContext();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    } else if (formData.firstName.trim().length > 50) {
      newErrors.firstName = "First name must be less than 50 characters";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    } else if (formData.lastName.trim().length > 50) {
      newErrors.lastName = "Last name must be less than 50 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.phoneNumber && formData.phoneNumber.trim() && !/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    if (!formData.departmentId || formData.departmentId <= 0) {
      newErrors.departmentId = "Department is required";
    }

    if (formData.address && formData.address.trim().length > 200) {
      newErrors.address = "Address must be less than 200 characters";
    }

    // Add validation for date of birth
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else {
      const today = new Date();
      const minAge = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
      const maxAge = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
      
      if (formData.dateOfBirth > minAge) {
        newErrors.dateOfBirth = "Must be at least 18 years old";
      } else if (formData.dateOfBirth < maxAge) {
        newErrors.dateOfBirth = "Please enter a valid date of birth";
      }
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
      description: "Setting up new lecturer",
      duration: 2000
    });

    try {
      await createLecturer({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber?.trim() || undefined,
        departmentId: formData.departmentId,
        address: formData.address?.trim() || undefined,
        dateOfBirth: formData.dateOfBirth,
      });

      success({
        title: "Lecturer Created!",
        description: `${formData.firstName.trim()} ${formData.lastName.trim()} has been successfully created`,
        duration: 4000
      });

      // Reset form and close dialog
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        departmentId: 0,
        address: "",
        dateOfBirth: new Date(),
      });
      setIsOpen(false);
    } catch (err: any) {
      console.error("Error creating lecturer:", err);
      error({
        title: "Creation Failed",
        description: err.response?.data?.message || state.error || "Failed to create lecturer",
        duration: 6000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateLecturer, value: string | number | Date) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleDepartmentChange = (value: string) => {
    const departmentId = parseInt(value);
    handleInputChange("departmentId", departmentId);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Name */}
        <div className="space-y-2">
          <Label htmlFor="firstName">
            First Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="firstName"
            type="text"
            placeholder="Enter first name"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            className={errors.firstName ? "border-red-500" : ""}
            disabled={isLoading || state.loading}
            maxLength={50}
          />
          {errors.firstName && (
            <p className="text-sm text-red-500">{errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <Label htmlFor="lastName">
            Last Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Enter last name"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            className={errors.lastName ? "border-red-500" : ""}
            disabled={isLoading || state.loading}
            maxLength={50}
          />
          {errors.lastName && (
            <p className="text-sm text-red-500">{errors.lastName}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter email address"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={errors.email ? "border-red-500" : ""}
            disabled={isLoading || state.loading}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            type="tel"
            placeholder="Enter phone number"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            className={errors.phoneNumber ? "border-red-500" : ""}
            disabled={isLoading || state.loading}
          />
          {errors.phoneNumber && (
            <p className="text-sm text-red-500">{errors.phoneNumber}</p>
          )}
        </div>

        {/* Department Dropdown */}
        <div className="space-y-2">
          <Label htmlFor="department">
            Department <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.departmentId > 0 ? formData.departmentId.toString() : ""}
            onValueChange={handleDepartmentChange}
            disabled={isLoading || state.loading || departmentState.loading}
          >
            <SelectTrigger className={errors.departmentId ? "border-red-500" : ""}>
              <SelectValue placeholder="Select a department" />
            </SelectTrigger>
            <SelectContent>
              {departmentState.loading ? (
                <SelectItem value="loading" disabled>
                  <div className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading departments...
                  </div>
                </SelectItem>
              ) : departmentState.departments.length === 0 ? (
                <SelectItem value="no-departments" disabled>
                  No departments available
                </SelectItem>
              ) : (
                departmentState.departments.map((department) => (
                  <SelectItem
                    key={department.departmentId}
                    value={department.departmentId.toString()}
                  >
                    {department.departmentName}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {errors.departmentId && (
            <p className="text-sm text-red-500">{errors.departmentId}</p>
          )}
          {departmentState.error && (
            <p className="text-sm text-orange-500">
              Error loading departments: {departmentState.error}
            </p>
          )}
        </div>

        {/* Date of Birth */}
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">
            Date of Birth <span className="text-red-500">*</span>
          </Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth.toISOString().split('T')[0]}
            onChange={(e) => handleInputChange("dateOfBirth", new Date(e.target.value))}
            className={errors.dateOfBirth ? "border-red-500" : ""}
            disabled={isLoading || state.loading}
          />
          {errors.dateOfBirth && (
            <p className="text-sm text-red-500">{errors.dateOfBirth}</p>
          )}
        </div>
      </div>

      {/* Address - Full width */}
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          type="text"
          placeholder="Enter address"
          value={formData.address}
          onChange={(e) => handleInputChange("address", e.target.value)}
          className={errors.address ? "border-red-500" : ""}
          disabled={isLoading || state.loading}
          maxLength={200}
        />
        {errors.address && (
          <p className="text-sm text-red-500">{errors.address}</p>
        )}
        {formData.address && (
          <p className="text-xs text-muted-foreground">
            {formData.address.length}/200 characters
          </p>
        )}
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
              Creating...
            </>
          ) : (
            "Create Lecturer"
          )}
        </Button>
      </div>
    </form>
  );
}

export default LecturerForm;