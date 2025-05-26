import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLog } from "@/hooks/useLog";
import { CreateLog } from "@/types/patient-log";
import { useDentist } from "@/hooks/useDentist";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dentist } from "@/types/dentist";
// Zod schema for form validation
const logSchema = z.object({
  actionType: z.string().min(1, "Action Type is required"),
  description: z.string().min(1, "Description is required"),
  dentistId: z.string().min(1, "Dentist ID is required"),
});

export type LogFormInputs = z.infer<typeof logSchema>;

interface LogFormProps {
  setIsOpen: (isOpen: boolean) => void;
  patientID: string;
}

const LogForm: React.FC<LogFormProps> = ({ setIsOpen, patientID }) => {
  const { toast } = useToast();
  const { createLog } = useLog();
  const { dentistState } = useDentist();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LogFormInputs>({
    resolver: zodResolver(logSchema),
  });

  const onSubmit = async (data: LogFormInputs) => {
    try {
      await createLog(data as CreateLog, patientID);
      toast({
        title: "Log Created",
        description: "New log has been added with action: " + data.actionType,
      });
      reset();
      setIsOpen(false);
    } catch (error: any) {
      console.error("Error creating log:", error);
      toast({
        title: "Error creating log",
        description:
          error.response?.data?.details.error ||
          "An error occurred while creating the log",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full rounded px-5 md:px-0">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Action Type field */}
        <div>
          <label htmlFor="actionType" className="block font-medium">
            Action Type
          </label>
          <Input
            id="actionType"
            placeholder="Enter action type"
            {...register("actionType")}
            className="w-full border p-2 rounded"
          />
          {errors.actionType && (
            <p className="text-red-500 text-sm">{errors.actionType.message}</p>
          )}
        </div>

        {/* Description field */}
        <div>
          <label htmlFor="description" className="block font-medium">
            Description
          </label>
          <Input
            id="description"
            placeholder="Enter description"
            {...register("description")}
            className="w-full border p-2 rounded"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        {/* Dentist ID field */}
        <div>
          <label htmlFor="dentistId" className="block font-medium">
            Dentist
          </label>
          <Select
            onValueChange={(value) => {
              setValue("dentistId", value as any); // Directly update the dentistId form field
            }}
          >
            <SelectTrigger className={`w-full `}>
              <SelectValue placeholder="Select Doctor" />
            </SelectTrigger>
            <SelectContent>
              {dentistState.dentists.map((dentist: Dentist) => (
                <SelectItem key={dentist.id} value={dentist.id.toString()}>
                  Dr.{dentist.firstName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.dentistId && (
            <p className="text-red-500 text-sm">{errors.dentistId.message}</p>
          )}
        </div>

        {/* Submit button */}
        <Button type="submit" className="w-full py-2" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Create Log"}
        </Button>
      </form>
    </div>
  );
};

export default LogForm;
