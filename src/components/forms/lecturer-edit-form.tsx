import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLecturerContext } from "@/contexts/lecturerContext";
import { useDepartmentContext } from "@/contexts/departmentContext";
import { CreateLecturer } from "@/types/lecturer";
import { Loader2 } from "lucide-react";

interface LecturerEditFormProps {
  lecturerId: number;
  setIsOpen: (open: boolean) => void;
}

type FormErrors = {
  [K in keyof CreateLecturer]?: string;
};

function LecturerEditForm({ 
  lecturerId, 
  setIsOpen 
}: LecturerEditFormProps) {
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
  const [isLoadingData, setIsLoadingData] = useState(true);

  const { success, error, info } = useToast();
  const { state, updateLecturer, fetchLecturerById } = useLecturerContext();
  const { state: departmentState } = useDepartmentContext();

  // Load existing lecturer data
  useEffect(() => {
    const loadLecturer = async () => {
      try {
        setIsLoadingData(true);
        
        // First check if lecturer exists in current state
        const existingLecturer = state.lecturers.find(
          lecturer => lecturer.lecturerId === lecturerId
        );
        
        if (existingLecturer) {
          setFormData({
            firstName: existingLecturer.firstName,
            lastName: existingLecturer.lastName,
            email: existingLecturer.email,
            phoneNumber: existingLecturer.phoneNumber || "",
            departmentId: existingLecturer.departmentId,
            address: existingLecturer.address || "",
            dateOfBirth: existingLecturer.dateOfBirth,
          });
        } else {
          // Fetch from API if not in current state
          const lecturer = await fetchLecturerById(lecturerId);
          setFormData({
            firstName: lecturer.firstName,
            lastName: lecturer.lastName,
            email: lecturer.email,
            phoneNumber: lecturer.phoneNumber || "",
            departmentId: lecturer.departmentId,
            address: lecturer.address || "",
            dateOfBirth: lecturer.dateOfBirth,
          });
        }
      } catch (err) {
        console.error("Error loading lecturer:", err);
        error({
          title: "Loading Failed",
          description: "Failed to load lecturer data",
          duration: 5000
        });
        setIsOpen(false);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadLecturer();
  }, [lecturerId, state.lecturers, fetchLecturerById, setIsOpen, error]);

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

    if (formData.phoneNumber && formData.phoneNumber.trim() && !/^\+?[\d\s\-()]{10,}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    if (!formData.departmentId || formData.departmentId <= 0) {
      newErrors.departmentId = "Department is required";
    }

    if (formData.address && formData.address.trim().length > 200) {
      newErrors.address = "Address must be less than 200 characters";
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
      description: "Updating lecturer information",
      duration: 2000
    });

    try {
      await updateLecturer(lecturerId, {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber?.trim() || undefined,
        departmentId: formData.departmentId,
        address: formData.address?.trim() || undefined,
        dateOfBirth: formData.dateOfBirth,
      });

      success({
        title: "Updated Successfully!",
        description: "Lecturer information has been updated",
        duration: 4000
      });

      setIsOpen(false);
    } catch (err: unknown) {
      console.error("Error updating lecturer:", err);
      error({
        title: "Update Failed",
        description: (err as { response?: { data?: { message?: string } } }).response?.data?.message || state.error || "Failed to update lecturer",
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

  if (isLoadingData) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading lecturer data...</span>
      </div>
    );
  }

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
            value={formData.dateOfBirth instanceof Date ? 
              formData.dateOfBirth.toISOString().split('T')[0] : 
              new Date(formData.dateOfBirth).toISOString().split('T')[0]
            }
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
              Updating...
            </>
          ) : (
            "Update Lecturer"
          )}
        </Button>
      </div>
    </form>
  );
}

export default LecturerEditForm;