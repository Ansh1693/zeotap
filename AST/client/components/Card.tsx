import { useState } from "react";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card as CardUI,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EvaluateModal } from "./EvaluateModal";
import { CardItem } from "./api";

interface CardProps {
  card: CardItem;
  onEdit: (card: CardItem) => void;
  onEvaluate: (data: { ruleId: string; userData: any }) => void;
}

export function Card({ card, onEdit, onEvaluate }: CardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCard, setEditedCard] = useState(card);
  const [isEvaluateModalOpen, setIsEvaluateModalOpen] = useState(false);

  const handleSave = () => {
    onEdit(editedCard);
    setIsEditing(false);
  };

  return (
    <CardUI className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {isEditing ? (
            <Input
              value={editedCard.name}
              onChange={(e) =>
                setEditedCard({ ...editedCard, name: e.target.value })
              }
            />
          ) : (
            card.name
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        {isEditing ? (
          <Textarea
            value={editedCard.ruleString ?? ""}
            onChange={(e) =>
              setEditedCard({ ...editedCard, ruleString: e.target.value })
            }
          />
        ) : (
          <p>{card.ruleString}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {isEditing ? (
          <Button onClick={handleSave}>Save</Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => setIsEvaluateModalOpen(true)}
          >
            Evaluate
          </Button>
        )}
      </CardFooter>
      <EvaluateModal
        isOpen={isEvaluateModalOpen}
        onClose={() => setIsEvaluateModalOpen(false)}
        onEvaluate={(jsonInput) =>
          onEvaluate({ ruleId: card._id, userData: jsonInput })
        }
        cardName={card.name}
      />
    </CardUI>
  );
}
