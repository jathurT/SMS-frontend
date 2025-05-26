import { useContext } from "react";
import { DentistContext } from "@/contexts/dentistContext";

// Custom hook to use DentistContext
export const useDentist = () => {
  const context = useContext(DentistContext);

  if (!context) {
    throw new Error("useDentist must be used within a DentistProvider");
  }

  return context;
};
