import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/hooks/useBooking"; // Assumes you have this hook
import { useToast } from "@/hooks/use-toast";
interface AppointmentDeleteFormProps {
  cardId: string;
  setIsOpen: (isOpen: boolean) => void;
}

const AppointmentDeleteForm: React.FC<AppointmentDeleteFormProps> = ({
  cardId,
  setIsOpen,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteBooking } = useBooking(); // Custom hook for managing schedules
  const { toast } = useToast();
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteBooking(cardId);

      // Close dialog after successful deletion

      toast({
        title: "Appointment deleted",
        description: "Appointment deleted successfully",
      });
    } catch (error: any) {
      console.error("Error deleting appointment:", error);
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
    <div className="flex flex-col gap-4 ">
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

export default AppointmentDeleteForm;
