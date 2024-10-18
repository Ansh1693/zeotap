import { Card } from "./Card";
import { CardItem } from "./api";

interface CardListProps {
  cards: CardItem[];
  onEdit: (card: CardItem) => void;
  onEvaluate: (data: { ruleId: string; userData: any }) => void;
}

export function CardList({ cards, onEdit, onEvaluate }: CardListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => (
        <Card
          key={card._id}
          card={card}
          onEdit={onEdit}
          onEvaluate={onEvaluate}
        />
      ))}
    </div>
  );
}
