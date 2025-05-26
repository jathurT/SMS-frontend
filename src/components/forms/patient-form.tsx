import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePatient } from "@/hooks/usePatient";
import { CreatePatient } from "@/types/patient";

// Zod schema for form validation
const patientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  nic: z
    .string()
    .regex(/^(\d{9}[VX]|[1-9]\d{11})$/, "Please enter a valid NIC number")
    .min(10, "NIC number should be 10 characters")
    .max(12, "NIC number should be 12 characters"),
  contactNumbers: z
    .string()
    .min(1, "At least one contact number is required")
    .refine((val) => {
      const numbers = val.split(",").map((num) => num.trim());
      return numbers.every((num) => /^\d{10}$/.test(num)); // Validate all phone numbers
    }, "Please enter valid phone numbers, separated by commas"),
});

export type PatientFormInputs = z.infer<typeof patientSchema>;

interface PatientFormProps {
  setIsOpen: (isOpen: boolean) => void;
}

const PatientForm: React.FC<PatientFormProps> = ({ setIsOpen }) => {
  const { toast } = useToast();
  const { createPatient } = usePatient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PatientFormInputs>({
    resolver: zodResolver(patientSchema),
  });

  const onSubmit = async (data: PatientFormInputs) => {
    try {
      // Split the contactNumbers string into an array of numbers
      const contactNumbersArray = data.contactNumbers
        .split(",")
        .map((num) => num.trim());

      // Create the patient with the contact numbers as an array
      await createPatient({
        ...data,
        contactNumbers: contactNumbersArray,
      } as CreatePatient);

      toast({
        title: "Patient Created",
        description: "New patient has been added with name: " + data.name,
      });
      reset();
      setIsOpen(false);
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Error creating patient",
        description:
          error.response?.data?.details.error ||
          "An error occurred while creating the patient",
        variant: "destructive",
      });
      console.error("Error creating patient:", error);
    }
  };

  return (
    <div className="w-full rounded px-5 md:px-0">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Patient name field */}
        <div>
          <label htmlFor="name" className="block font-medium">
            Name
          </label>
          <Input
            id="name"
            placeholder="Enter patient name"
            {...register("name")}
            className="w-full border p-2 rounded"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Patient email field */}
        <div>
          <label htmlFor="email" className="block font-medium">
            Email
          </label>
          <Input
            id="email"
            placeholder="Enter email"
            {...register("email")}
            className="w-full border p-2 rounded"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Patient NIC field */}
        <div>
          <label htmlFor="nic" className="block font-medium">
            NIC
          </label>
          <Input
            id="nic"
            placeholder="Enter NIC number"
            {...register("nic")}
            className="w-full border p-2 rounded"
          />
          {errors.nic && (
            <p className="text-red-500 text-sm">{errors.nic.message}</p>
          )}
        </div>

        {/* Patient contact number field */}
        <div>
          <label htmlFor="contactNumbers" className="block font-medium">
            Contact Numbers (comma separated)
          </label>
          <Input
            id="contactNumbers"
            placeholder="Enter contact numbers"
            {...register("contactNumbers")}
            className="w-full border p-2 rounded"
          />
          {errors.contactNumbers && (
            <p className="text-red-500 text-sm">
              {errors.contactNumbers.message}
            </p>
          )}
        </div>

        {/* Submit button */}
        <Button type="submit" className="w-full py-2" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Create Patient"}
        </Button>
      </form>
    </div>
  );
};

export default PatientForm;
