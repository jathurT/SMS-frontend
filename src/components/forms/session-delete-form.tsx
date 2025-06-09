import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSessionContext } from "@/contexts/sessionContext";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";

interface SessionDeleteFormProps {
  sessionId: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function SessionDeleteForm({
  sessionId,
  isOpen,
  setIsOpen,
}: SessionDeleteFormProps) {
  const { deleteSession } = useSessionContext();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteSession(sessionId);
      toast({
        title: "Success!",
        description: "Session deleted successfully",
      });
      setIsOpen(false);
    } catch (error: any) {
      console.error("Error deleting session:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete session",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Delete Session
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this session? This action cannot be undone.
            All attendance records for this session will also be deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Session"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}