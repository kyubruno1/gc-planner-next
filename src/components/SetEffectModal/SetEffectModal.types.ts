interface BonusStats {
  [statKey: string]: number;
}

interface Bonuses {
  [piecesCount: string]: BonusStats;
}

export interface SetDataItem {
  bonusType: string;
  name: string;
  setPieces: string[];
  [key: string]: string | string[] | Record<string, number>;
}

export interface ActiveSet {
  name: string;
  bonusType: string;
  equippedPieces: string[];
  totalPieces: string[];
  pieceCount: number;
  bonuses: Bonuses;
}