import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (card: { name: string; ruleString: string }) => void;
  onCombine: (card: { name: string; ruleStrings: string[] }) => void;
}

export function AddCardModal({
  isOpen,
  onClose,
  onAdd,
  onCombine,
}: AddCardModalProps) {
  const [newCard, setNewCard] = useState({ name: "", rules: [""] });

  const handleAdd = () => {
    if (newCard.rules.length > 1) {
      onCombine({ name: newCard.name, ruleStrings: newCard.rules });
    } else {
      onAdd({ name: newCard.name, ruleString: newCard.rules[0] });
    }
    setNewCard({ name: "", rules: [""] });
  };

  const handleRuleChange = (index: number, value: string) => {
    const updatedRules = [...newCard.rules];
    updatedRules[index] = value;
    setNewCard({ ...newCard, rules: updatedRules });
  };

  const handleAddRule = () => {
    setNewCard({ ...newCard, rules: [...newCard.rules, ""] });
  };

  const handleRemoveRule = (index: number) => {
    const updatedRules = newCard.rules.filter((_, i) => i !== index);
    setNewCard({ ...newCard, rules: updatedRules });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Card</DialogTitle>
          <DialogDescription>
            Enter the name and rules for the new card.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={newCard.name}
              onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
              className="col-span-3"
            />
          </div>
          {newCard.rules.map((rule, index) => (
            <div key={index} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={`rule-${index}`} className="text-right">
                Rule {index + 1}
              </Label>
              <Textarea
                id={`rule-${index}`}
                value={rule}
                onChange={(e) => handleRuleChange(index, e.target.value)}
                className="col-span-3"
              />
              {newCard.rules.length > 1 && (
                <Button
                  onClick={() => {
                    handleRemoveRule(index);
                  }}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
          <Button onClick={handleAddRule}>Add Rule</Button>
        </div>
        <DialogFooter>
          <Button onClick={handleAdd}>Add Card</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
