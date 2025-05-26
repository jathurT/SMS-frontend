import { useContext } from "react";
import { PatientLogContext } from "@/contexts/patientLogContext";

export const useLog = () => {
  const context = useContext(PatientLogContext);
  if (!context) {
    throw new Error("usePatient must be used within a PatientLogProvider");
  }
  return context;
};
