"use client";

import { StoneData } from "@/types/stones";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { Card } from "../types/cards";
import { CharacterStatus } from "../types/characterStatus";
import { EquippedItem } from "../types/equip";
import { ItemProps } from "../types/ItemProps";

// Tipo para o bonus set que virá do banco
interface BonusSetType {
  bonusType: string;
  [key: string]: any; // ajuste conforme sua estrutura real
}

type EquipState = Record<string, EquippedItem>;

interface EquipContextType {
  equipped: EquipState;
  loadingBonusSets: boolean;
  errorBonusSets: string | null;

  setFullEquip: (newEquip: EquipState) => void;
  equipItem: (item: EquippedItem) => void;
  unequipItem: (type: string) => void;
  clearEquipments: () => void;

  countBonusType: (bonusType: string) => number;
  countAllBonusTypes: () => Record<string, number>;

  calculateBonusExtras: () => Partial<CharacterStatus>;
  flattenBonusExtras: (bonusesByType: Record<string, Partial<CharacterStatus>>) => Partial<CharacterStatus>;

  equipCards: (slot: string, cards: Card[]) => void;
  removeCardsFromSlot: (slot: string) => void;

  equipProps: (slot: string, selectedProps: Partial<ItemProps>) => void;
  extractSelectedPropsBonus: () => Partial<CharacterStatus>;

  extractCardEffectsBonus: () => Partial<CharacterStatus>;

  equipStone: (slot: string, stone: StoneData) => void;
  unequipStone: (slot: string) => void;
}

const EquipContext = createContext<EquipContextType | undefined>(undefined);

export function EquipProvider({ children }: { children: ReactNode }) {
  const [equipped, setEquipped] = useState<EquipState>({});

  // Estado para bonus sets vindos do banco
  const [bonusSets, setBonusSets] = useState<BonusSetType[]>([]);
  const [loadingBonusSets, setLoadingBonusSets] = useState(true);
  const [errorBonusSets, setErrorBonusSets] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBonusSets() {
      try {
        setLoadingBonusSets(true);
        setErrorBonusSets(null);

        const res = await fetch("/api/bonus-sets");
        if (!res.ok) throw new Error(`Erro ${res.status}`);

        const data = await res.json();
        setBonusSets(data);
      } catch (err: any) {
        setErrorBonusSets(err.message || "Erro ao carregar bônus");
      } finally {
        setLoadingBonusSets(false);
      }
    }

    fetchBonusSets();
  }, []);

  function setFullEquip(newEquip: EquipState) {
    setEquipped(newEquip);
  }

  function equipItem(item: EquippedItem) {
    setEquipped((prev) => ({ ...prev, [item.type]: item }));
  }

  function unequipItem(type: string) {
    setEquipped((prev) => {
      const copy = { ...prev };
      delete copy[type];
      return copy;
    });
  }

  function clearEquipments() {
    setEquipped({});
  }

  function countBonusType(bonusType: string): number {
    const slotsWithBonus = new Set<string>();
    for (const slot in equipped) {
      if (equipped[slot].bonusType === bonusType) {
        slotsWithBonus.add(slot);
      }
    }
    return slotsWithBonus.size;
  }

  function countAllBonusTypes(): Record<string, number> {
    const counts: Record<string, Set<string>> = {};
    for (const slot in equipped) {
      const bonus = equipped[slot].bonusType;
      if (!counts[bonus]) counts[bonus] = new Set();
      counts[bonus].add(slot);
    }
    const result: Record<string, number> = {};
    for (const bonus in counts) {
      result[bonus] = counts[bonus].size;
    }
    return result;
  }

  function calculateBonusExtras(): Partial<CharacterStatus> {
    if (loadingBonusSets || errorBonusSets) return {};

    const counts = countAllBonusTypes();
    const bonusesByType: Record<string, Partial<CharacterStatus>> = {};

    for (const bonusSet of bonusSets) {
      const { bonusType, ...restBonuses } = bonusSet;
      const qty = counts[bonusType] || 0;

      const bonusStats: Partial<CharacterStatus> = {};

      for (const key in restBonuses) {
        const minEquip = Number(key);
        if (qty >= minEquip) {
          const values = restBonuses[key];
          for (const stat in values) {
            bonusStats[stat as keyof CharacterStatus] =
              (bonusStats[stat as keyof CharacterStatus] || 0) + values[stat];
          }
        }
      }

      if (Object.keys(bonusStats).length > 0) {
        bonusesByType[bonusType] = bonusStats;
      }
    }

    return bonusesByType;
  }

  function flattenBonusExtras(bonusesByType: Record<string, Partial<CharacterStatus>>): Partial<CharacterStatus> {
    const flatBonus: Partial<CharacterStatus> = {};
    for (const bonusType in bonusesByType) {
      const bonusStats = bonusesByType[bonusType];
      for (const stat in bonusStats) {
        flatBonus[stat as keyof CharacterStatus] =
          (flatBonus[stat as keyof CharacterStatus] || 0) + (bonusStats[stat as keyof CharacterStatus] || 0);
      }
    }
    return flatBonus;
  }

  function equipCards(slot: string, cards: Card[]) {
    setEquipped((prev) => {
      const item = prev[slot];
      if (!item) return prev;

      return {
        ...prev,
        [slot]: {
          ...item,
          cards,
        },
      };
    });
  }

  function removeCardsFromSlot(slot: string) {
    setEquipped((prev) => {
      const item = prev[slot];
      if (!item) return prev;

      const updatedItem = { ...item };
      delete updatedItem.cards;

      return {
        ...prev,
        [slot]: updatedItem,
      };
    });
  }

  function equipProps(slot: string, selectedProps: Partial<ItemProps>) {
    setEquipped((prev) => {
      const item = prev[slot];
      if (!item) return prev;

      return {
        ...prev,
        [slot]: {
          ...item,
          selectedProps,
        },
      };
    });
  }

  function extractSelectedPropsBonus(): Partial<CharacterStatus> {
    const bonuses: Partial<CharacterStatus> = {};
    Object.values(equipped).forEach((item) => {
      if (!item.selectedProps) return;
      for (const key in item.selectedProps) {
        const value = item.selectedProps[key];
        if (typeof value === "number") {
          bonuses[key as keyof CharacterStatus] =
            (bonuses[key as keyof CharacterStatus] || 0) + value;
        }
      }
    });
    return bonuses;
  }

  function extractCardEffectsBonus(): Partial<CharacterStatus> {
    const bonuses: Partial<CharacterStatus> = {};
    Object.values(equipped).forEach((item) => {
      if (!item.cards) return;
      for (const card of item.cards) {
        for (const effect of card.effects) {
          const key = effect.name as keyof CharacterStatus;
          bonuses[key] = (bonuses[key] || 0) + effect.value;
        }
      }
    });
    return bonuses;
  }

  function equipStone(slot: string, stone: StoneData) {
    setEquipped((prev) => {
      const item = prev[slot];
      if (!item) return prev;

      return {
        ...prev,
        [slot]: {
          ...item,
          stone,
        },
      };
    });
  }

  function unequipStone(slot: string) {
    setEquipped((prev) => {
      const item = prev[slot];
      if (!item) return prev;

      const { stone, ...rest } = item;
      return {
        ...prev,
        [slot]: rest,
      };
    });
  }

  return (
    <EquipContext.Provider
      value={{
        equipped,
        loadingBonusSets,
        errorBonusSets,
        setFullEquip,
        equipItem,
        unequipItem,
        clearEquipments,
        countBonusType,
        countAllBonusTypes,
        calculateBonusExtras,
        flattenBonusExtras,
        equipCards,
        removeCardsFromSlot,
        equipProps,
        extractSelectedPropsBonus,
        extractCardEffectsBonus,
        equipStone,
        unequipStone,
      }}
    >
      {children}
    </EquipContext.Provider>
  );
}

export function useEquip() {
  const context = useContext(EquipContext);
  if (!context) throw new Error("useEquip must be used within EquipProvider");
  return context;
}
