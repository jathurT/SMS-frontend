import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { usePatient } from "@/hooks/usePatient";
interface PatientDeleteFormProps {
  cardId: string;
  setIsOpen: (isOpen: boolean) => void;
}

const PatientDeleteForm: React.FC<PatientDeleteFormProps> = ({
  cardId,
  setIsOpen,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { deletePatient } = usePatient(); // Custom hook for managing schedules
  const { toast } = useToast();
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePatient(cardId);

      // Close dialog after successful deletion

      toast({
        title: "Patient deleted",
        description: "Patient deleted successfully",
      });
    } catch (error: any) {
      console.error("Error deleting Patient:", error);
      setIsDeleting(false);
      toast({
        title: "Uh oh! Something went wrong.",
        description:
          error.response?.data?.details?.error || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-flow-col gap-5 px-4">
        <Button
          variant="outline"
          onClick={() => setIsOpen(false)}
          disabled={isDeleting}
          className="w-full"
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
          className="w-full"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </div>
  );
};

export default PatientDeleteForm;
