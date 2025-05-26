import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePatient } from "@/hooks/usePatient";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Zod schema for form validation
const patientEditSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  nic: z
    .string()
    .regex(/^\d{9}[VX]|[1-9]\d{11}$/i, "Please enter a valid NIC number")
    .min(10, "NIC number should be 10 characters")
    .max(12, "NIC number should be 12 characters"),
  contactNumbers: z
    .string()
    .min(1, "At least one contact number is required")
    .refine((val) => {
      const numbers = val.split(",").map((num) => num.trim());
      return numbers.every((num) => /^\d{10}$/.test(num));
    }, "Please enter valid phone numbers, separated by commas"),
});

type PatientEditFormInputs = z.infer<typeof patientEditSchema>;

interface PatientEditFormProps {
  cardId: string; // The ID of the patient to be edited
  setIsOpen: (isOpen: boolean) => void;
}

const PatientEditForm: React.FC<PatientEditFormProps> = ({
  cardId,
  setIsOpen,
}) => {
  const { getPatientById, updatePatient } = usePatient();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PatientEditFormInputs>({
    resolver: zodResolver(patientEditSchema),
  });

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const patient = await getPatientById(cardId);
        setValue("name", patient.name);
        setValue("email", patient.email);
        setValue("nic", patient.nic);
        setValue("contactNumbers", patient.contactNumbers.join(", "));
      } catch (error) {
        toast({
          title: "Error loading patient",
          description: "Could not load patient details",
          variant: "destructive",
        });
      }
    };

    fetchPatient();
  }, [cardId, getPatientById, setValue, toast]);

  const onSubmit = async (data: PatientEditFormInputs) => {
    try {
      const updatedData = {
        ...data,
        contactNumbers: data.contactNumbers.split(",").map((num) => num.trim()),
      };
      await updatePatient(cardId, updatedData);

      toast({
        title: "Patient Updated",
        description: "Patient details have been updated successfully.",
      });
      setIsOpen(false);
    } catch (error: any) {
      toast({
        title: "Error updating patient",
        description: error.response?.data?.details.error || "An error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full rounded px-5 md:px-0">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block font-medium">
            Name
          </label>
          <Input
            id="name"
            {...register("name")}
            className="w-full border p-2 rounded"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block font-medium">
            Email
          </label>
          <Input
            id="email"
            {...register("email")}
            className="w-full border p-2 rounded"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="nic" className="block font-medium">
            NIC
          </label>
          <Input
            id="nic"
            {...register("nic")}
            className="w-full border p-2 rounded"
          />
          {errors.nic && (
            <p className="text-red-500 text-sm">{errors.nic.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="contactNumbers" className="block font-medium">
            Contact Numbers
          </label>
          <Input
            id="contactNumbers"
            {...register("contactNumbers")}
            placeholder="Enter numbers separated by commas"
            className="w-full border p-2 rounded"
          />
          {errors.contactNumbers && (
            <p className="text-red-500 text-sm">
              {errors.contactNumbers.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Update Patient"}
        </Button>
      </form>
    </div>
  );
};

export default PatientEditForm;
