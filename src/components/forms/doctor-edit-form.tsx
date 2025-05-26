import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDentist } from "@/hooks/useDentist";
import { useToast } from "@/hooks/use-toast";
import Lorder from "@/components/Lorder";
import { Dentist, UpdateDentist } from "@/types/dentist";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const doctorEditSchema = z.object({
  userName: z.string().min(3, "Username must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  gender: z.enum(["Male", "Female"]).refine((val) => val !== undefined, {
    message: "Gender is required",
  }),
  firstName: z.string().min(1, "First Name is required"),
  specialization: z.string().min(1, "Specialization is required"),
  licenseNumber: z.string().min(1, "License Number is required"),
  nic: z
    .string()
    .regex(/^\d{9}[VX]|[1-9]\d{11}$/i, "Please enter a valid NIC number")
    .min(10, "NIC number should be 10 characters")
    .max(12, "NIC number should be 12 characters"),
  phoneNumber: z.string().regex(/^\d{10}$/, "Phone Number must be 10 digits"),
});

export type DoctorEditFormInputs = z.infer<typeof doctorEditSchema>;

interface EditDoctorFormProps {
  cardId: string; // The ID of the doctor to be edited
  setIsOpen: (isOpen: boolean) => void;
}

const DoctorEditForm: React.FC<EditDoctorFormProps> = ({
  cardId,
  setIsOpen,
}) => {
  const { getDentistById, updateDentist } = useDentist();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<DoctorEditFormInputs>({
    resolver: zodResolver(doctorEditSchema),
  });

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const doctor = await getDentistById(cardId);
        setValue("userName", doctor.userName);
        setValue("email", doctor.email);
        setValue("gender", doctor.gender);
        setValue("firstName", doctor.firstName);
        setValue("specialization", doctor.specialization);
        setValue("licenseNumber", doctor.licenseNumber);
        setValue("nic", doctor.nic);
        setValue("phoneNumber", doctor.phoneNumber);
      } catch (error) {
        toast({
          title: "Error loading doctor",
          description: "Could not load doctor details",
          variant: "destructive",
        });
      }
    };

    fetchDoctor();
  }, [cardId, getDentistById, setValue, toast]);

  const onSubmit = async (data: DoctorEditFormInputs) => {
    try {
      await updateDentist(cardId, data as UpdateDentist);

      toast({
        title: "Doctor Updated",
        description: "Doctor details have been updated successfully.",
      });
      setIsOpen(false);
    } catch (error: any) {
      console.log(error.response?.data);
      toast({
        title: "Error updating doctor",
        description: error.response?.data?.details.error || "An error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full rounded px-5 md:px-0">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label htmlFor="userName" className="block font-medium">
              Username
            </label>
            <Input
              id="userName"
              {...register("userName")}
              className="w-full border p-2 rounded"
            />
            {errors.userName && (
              <p className="text-red-500 text-sm">{errors.userName.message}</p>
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
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label htmlFor="firstName" className="block font-medium">
              First Name
            </label>
            <Input
              id="firstName"
              {...register("firstName")}
              className="w-full border p-2 rounded"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="gender" className="block font-medium">
              Gender
            </label>
            <Select
              onValueChange={(value) => {
                setValue("gender", value as any); // Cast to the expected type
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className="text-red-500 text-sm">{errors.gender.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label htmlFor="specialization" className="block font-medium">
              Specialization
            </label>
            <Input
              id="specialization"
              {...register("specialization")}
              className="w-full border p-2 rounded"
            />
            {errors.specialization && (
              <p className="text-red-500 text-sm">
                {errors.specialization.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="licenseNumber" className="block font-medium">
              License Number
            </label>
            <Input
              id="licenseNumber"
              {...register("licenseNumber")}
              className="w-full border p-2 rounded"
            />
            {errors.licenseNumber && (
              <p className="text-red-500 text-sm">
                {errors.licenseNumber.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
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
            <label htmlFor="phoneNumber" className="block font-medium">
              Phone Number
            </label>
            <Input
              id="phoneNumber"
              {...register("phoneNumber")}
              className="w-full border p-2 rounded"
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
        </div>

        <Button type="submit" className="w-full " disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Update Doctor"}
        </Button>
      </form>
    </div>
  );
};

export default DoctorEditForm;
