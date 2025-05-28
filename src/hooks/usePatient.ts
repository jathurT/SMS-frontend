import { useContext } from "react";
import { PatientContext } from "@/contexts/patientContext";

export const usePatient = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error("useSchedules must be used within a ScheduleProvider");
  }
  return context;
};
