export interface CardSelectModalProps {
  slot: string;
  onSelectCard: (cardName: string) => void;
  onClose: () => void;
}