import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface EvaluateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEvaluate: (jsonInput: string) => void;
  cardName: string;
}

export function EvaluateModal({
  isOpen,
  onClose,
  onEvaluate,
  cardName,
}: EvaluateModalProps) {
  const [jsonInput, setJsonInput] = useState("");
  const { toast } = useToast();

  const handleEvaluate = () => {
    try {
      const parsedJson = JSON.parse(jsonInput);
      onEvaluate(parsedJson);
      setJsonInput("");
      onClose();
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to parse JSON data. Please enter valid JSON data.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Evaluate {cardName}</DialogTitle>
          <DialogDescription>Enter JSON data for evaluation</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="Enter JSON data here"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleEvaluate}>Evaluate</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
