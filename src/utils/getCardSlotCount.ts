export function getCardSlotCount(rarity: string): number {
  switch (rarity.toLowerCase()) {
    case "epic":
      return 2;
    case "legendary":
      return 3;
    case "ancient":
      return 4;
    case "rare":
      return 1;
    case "acessories":
      return 0;
    default:
      return 1;
  }
}