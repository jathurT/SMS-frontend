import { useContext } from "react";
import { ScheduleContext } from "@/contexts/scheduleContext";

export const useSchedules = () => {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error("useSchedules must be used within a ScheduleProvider");
  }
  return context;
};
