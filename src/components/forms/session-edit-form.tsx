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
import { useCourseContext } from "@/contexts/courseContext";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Clock } from "lucide-react";

const editSessionSchema = z.object({
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  lecturerId: z.string().min(1, "Lecturer is required"),
  courseId: z.string().min(1, "Course is required"),
}).refine((data) => {
  const start = new Date(`1970-01-01T${data.startTime}`);
  const end = new Date(`1970-01-01T${data.endTime}`);
  return end > start;
}, {
  message: "End time must be after start time",
  path: ["endTime"],
});

type EditSessionFormData = z.infer<typeof editSessionSchema>;

interface SessionEditFormProps {
  sessionId: number;
  setIsOpen: (open: boolean) => void;
}

export default function SessionEditForm({ sessionId, setIsOpen }: SessionEditFormProps) {
  const { updateSession, fetchSessionById, state } = useSessionContext();
  const { state: lecturerState, fetchLecturers } = useLecturerContext();
  const { state: courseState, fetchCourses } = useCourseContext();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditSessionFormData>({
    resolver: zodResolver(editSessionSchema),
  });

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchSessionById(sessionId),
          lecturerState.lecturers.length === 0 ? fetchLecturers() : Promise.resolve(),
          courseState.courses.length === 0 ? fetchCourses() : Promise.resolve(),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [sessionId, fetchSessionById, fetchLecturers, fetchCourses]);

  // Populate form when session data is loaded
  useEffect(() => {
    if (state.currentSession) {
      const session = state.currentSession;
      setValue("date", session.date);
      setValue("startTime", session.startTime.substring(0, 5)); // Remove seconds
      setValue("endTime", session.endTime.substring(0, 5)); // Remove seconds
      setValue("lecturerId", "1"); // You'll need to get this from the session data
      setValue("courseId", "1"); // You'll need to get this from the session data
    }
  }, [state.currentSession, setValue]);

  const onSubmit = async (data: EditSessionFormData) => {
    setIsSubmitting(true);
    try {
      await updateSession(sessionId, {
        courseId: data.courseId,
        lecturerId: data.lecturerId,
        date: data.date,
        startTime: data.startTime + ":00",
        endTime: data.endTime + ":00",
      });
      
      toast({
        title: "Success!",
        description: "Session updated successfully",
      });
      setIsOpen(false);
    } catch (error: any) {
      console.error("Error updating session:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update session",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Course */}
        <div className="space-y-2">
          <Label htmlFor="courseId">
            Course <span className="text-red-500">*</span>
          </Label>
          <Select onValueChange={(value) => setValue("courseId", value)}>
            <SelectTrigger className={errors.courseId ? "border-red-500" : ""}>
              <SelectValue placeholder="Select a course" />
            </SelectTrigger>
            <SelectContent>
              {courseState.courses.map((course) => (
                <SelectItem key={course.courseId} value={course.courseId.toString()}>
                  {course.courseCode} - {course.courseName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.courseId && (
            <p className="text-sm text-red-500">{errors.courseId.message}</p>
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
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Session"}
        </Button>
      </div>
    </form>
  );
}