import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSessionContext } from "@/contexts/sessionContext";
import { useLecturerContext } from "@/contexts/lecturerContext";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Clock } from "lucide-react";

const sessionSchema = z.object({
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  lecturerId: z.string().min(1, "Lecturer is required"),
}).refine((data) => {
  const start = new Date(`1970-01-01T${data.startTime}`);
  const end = new Date(`1970-01-01T${data.endTime}`);
  return end > start;
}, {
  message: "End time must be after start time",
  path: ["endTime"],
});

type SessionFormData = z.infer<typeof sessionSchema>;

interface SessionFormProps {
  setIsOpen: (open: boolean) => void;
  courseId?: number;
}

export default function SessionForm({ setIsOpen, courseId }: SessionFormProps) {
  const { createSession, state } = useSessionContext();
  const { state: lecturerState, fetchLecturers } = useLecturerContext();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SessionFormData>({
    resolver: zodResolver(sessionSchema),
  });

  const selectedLecturerId = watch("lecturerId");

  // Fetch lecturers on component mount
  useEffect(() => {
    if (lecturerState.lecturers.length === 0) {
      fetchLecturers();
    }
  }, [lecturerState.lecturers.length, fetchLecturers]);

  const onSubmit = async (data: SessionFormData) => {
    if (!courseId) {
      toast({
        title: "Error",
        description: "Course ID is required to create a session",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createSession(courseId, parseInt(data.lecturerId), {
        date: data.date,
        startTime: data.startTime + ":00", // Add seconds
        endTime: data.endTime + ":00", // Add seconds
      });
      
      toast({
        title: "Success!",
        description: "Session created successfully",
      });
      setIsOpen(false);
    } catch (error: any) {
      console.error("Error creating session:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create session",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date */}
        <div className="space-y-2">
          <Label htmlFor="date" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Session Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="date"
            type="date"
            {...register("date")}
            className={errors.date ? "border-red-500" : ""}
          />
          {errors.date && (
            <p className="text-sm text-red-500">{errors.date.message}</p>
          )}
        </div>

        {/* Lecturer */}
        <div className="space-y-2">
          <Label htmlFor="lecturerId">
            Lecturer <span className="text-red-500">*</span>
          </Label>
          <Select onValueChange={(value) => setValue("lecturerId", value)}>
            <SelectTrigger className={errors.lecturerId ? "border-red-500" : ""}>
              <SelectValue placeholder="Select a lecturer" />
            </SelectTrigger>
            <SelectContent>
              {lecturerState.lecturers.map((lecturer) => (
                <SelectItem key={lecturer.lecturerId} value={lecturer.lecturerId.toString()}>
                  {lecturer.firstName} {lecturer.lastName} - {lecturer.departmentName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.lecturerId && (
            <p className="text-sm text-red-500">{errors.lecturerId.message}</p>
          )}
        </div>

        {/* Start Time */}
        <div className="space-y-2">
          <Label htmlFor="startTime" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Start Time <span className="text-red-500">*</span>
          </Label>
          <Input
            id="startTime"
            type="time"
            {...register("startTime")}
            className={errors.startTime ? "border-red-500" : ""}
          />
          {errors.startTime && (
            <p className="text-sm text-red-500">{errors.startTime.message}</p>
          )}
        </div>

        {/* End Time */}
        <div className="space-y-2">
          <Label htmlFor="endTime" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            End Time <span className="text-red-500">*</span>
          </Label>
          <Input
            id="endTime"
            type="time"
            {...register("endTime")}
            className={errors.endTime ? "border-red-500" : ""}
          />
          {errors.endTime && (
            <p className="text-sm text-red-500">{errors.endTime.message}</p>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsOpen(false)}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || !courseId}>
          {isSubmitting ? "Creating..." : "Create Session"}
        </Button>
      </div>
    </form>
  );
}