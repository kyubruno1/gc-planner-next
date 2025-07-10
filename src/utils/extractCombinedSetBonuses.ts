// import { BonusSetType } from ""; // ajuste esse import para sua tipagem real
import { EquippedItem } from "@/types/equip";

export function extractCombinedSetBonuses(
  equipped: Record<string, EquippedItem>,
  // bonusSets: BonusSetType[]
  bonusSets: any[]
): Record<string, Record<string, Record<string, number>>> {
  const result: Record<string, Record<string, Record<string, number>>> = {};

  for (const set of bonusSets) {
    const piecesEquipped = Object.values(equipped).filter(
      (item) => item.bonusType === set.bonusType
    ).length;

    if (piecesEquipped === 0) continue;

    const bonusesToInclude: Record<string, Record<string, number>> = {};

    for (const threshold of Object.keys(set).filter((k) => /^\d+$/.test(k))) {
      const thresholdNum = Number(threshold);
      if (piecesEquipped >= thresholdNum) {
        bonusesToInclude[threshold] = set[threshold];
      }
    }

    if (Object.keys(bonusesToInclude).length > 0) {
      result[set.bonusType] = bonusesToInclude;
    }
  }

  return result;
}
