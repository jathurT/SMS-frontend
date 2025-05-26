import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLog } from "@/hooks/useLog";

interface LogDeleteFormProps {
  patientId: string;
  logId: string;
  setIsOpen: (isOpen: boolean) => void;
}

const LogDeleteForm: React.FC<LogDeleteFormProps> = ({
  patientId,
  logId,
  setIsOpen,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteLog } = useLog();
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteLog(patientId, logId);

      toast({
        title: "Log deleted",
        description: "Log has been successfully deleted",
      });

      setIsOpen(false);
    } catch (error: any) {
      console.error("Error deleting log:", error);

      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "An error occurred while deleting the log.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
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

export default LogDeleteForm;
