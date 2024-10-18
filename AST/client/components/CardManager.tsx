"use client";

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
} from "react-query";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CardList } from "./CardList";
import { AddCardModal } from "./AddCardModal";
import {
  fetchCards,
  addCard,
  editCard,
  evaluateCard,
  CardItem,
  combineRules,
} from "./api";

const queryClient = new QueryClient();

export default function CardManager() {
  return (
    <QueryClientProvider client={queryClient}>
      <CardManagerContent />
    </QueryClientProvider>
  );
}

function CardManagerContent() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { toast } = useToast();

  const {
    data: cards,
    isLoading,
    error,
  } = useQuery("cards", fetchCards, {
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to fetch cards. Please try again.",
        variant: "destructive",
      });
    },
  });

  const addCardMutation = useMutation(addCard, {
    onSuccess: () => {
      queryClient.invalidateQueries("cards");
      setIsAddModalOpen(false);
      toast({
        title: "Success",
        description: "Card added successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to add card. Please try again.",
        variant: "destructive",
      });
    },
  });

  const combineCardMutation = useMutation(combineRules, {
    onSuccess: () => {
      queryClient.invalidateQueries("cards");
      setIsAddModalOpen(false);
      toast({
        title: "Success",
        description: "Card combined successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to combine cards. Please try again.",
        variant: "destructive",
      });
    },
  });

  const editCardMutation = useMutation(editCard, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("cards");
      toast({
        title: "Success",
        description: "Card updated successfully.",
      });

      // update card in list
      const updatedCard = data as CardItem;
      const updatedCards = cards?.map((card) =>
        card._id === updatedCard._id ? updatedCard : card
      );
    },
    onError: (error) => {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update card. Please try again.",
        variant: "destructive",
      });
    },
  });

  const evaluateCardMutation = useMutation(evaluateCard, {
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: `Card evaluated successfully. Result: ${data.result}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to evaluate card. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {(error as Error).message}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Rule Manager</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create New Rule
        </Button>
      </div>
      <CardList
        cards={cards || []}
        onEdit={editCardMutation.mutate}
        onEvaluate={evaluateCardMutation.mutate}
      />
      <AddCardModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addCardMutation.mutate}
        onCombine={combineCardMutation.mutate}
      />
    </div>
  );
}
