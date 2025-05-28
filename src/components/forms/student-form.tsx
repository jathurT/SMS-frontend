import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useStudentContext } from "@/contexts/studentContext";
import { CreateStudent } from "@/types/student";
import { Loader2 } from "lucide-react";

interface StudentFormProps {
  setIsOpen: (open: boolean) => void;
}

// Define a proper error type that allows string messages for each field
type FormErrors = {
  [K in keyof CreateStudent]?: string;
};

function StudentForm({ setIsOpen }: StudentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateStudent>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: new Date(),
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const { success, error, info } = useToast();
  const { state, createStudent } = useStudentContext();

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

    if (formData.address && formData.address.trim().length > 200) {
      newErrors.address = "Address must be less than 200 characters";
    }

    // Add validation for date of birth
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else {
      const today = new Date();
      const minAge = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
      const maxAge = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
      
      if (formData.dateOfBirth > minAge) {
        newErrors.dateOfBirth = "Must be at least 16 years old";
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
      description: "Setting up new student",
      duration: 2000
    });

    try {
      await createStudent({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber?.trim() || "",
        address: formData.address?.trim() || "",
        dateOfBirth: formData.dateOfBirth,
      });

      success({
        title: "Student Created!",
        description: `${formData.firstName.trim()} ${formData.lastName.trim()} has been successfully created`,
        duration: 4000
      });

      // Reset form and close dialog
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        address: "",
        dateOfBirth: new Date(),
      });
      setIsOpen(false);
    } catch (err: unknown) {
      console.error("Error creating student:", err);
      const errorMessage = err instanceof Error && 'response' in err && 
        typeof err.response === 'object' && err.response !== null &&
        'data' in err.response && typeof err.response.data === 'object' &&
        err.response.data !== null && 'message' in err.response.data &&
        typeof err.response.data.message === 'string'
        ? err.response.data.message
        : state.error || "Failed to create student";
      
      error({
        title: "Creation Failed",
        description: errorMessage,
        duration: 6000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateStudent, value: string | Date) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
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
            "Create Student"
          )}
        </Button>
      </div>
    </form>
  );
}

export default StudentForm;