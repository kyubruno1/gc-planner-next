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

  async function setFullEquip(sc: any) {
    const { equipments } = sc;

    if (!equipments || !Array.isArray(equipments)) {
      console.error("Equipamentos inválidos para montar fullEquip");
      return;
    }

    const baseIds = equipments.map((eq) => eq.baseId);
    const allCardsFromEquip = equipments.flatMap(eq => eq.cards || []);
    const baseCardIds = allCardsFromEquip.map((card: any) => card.baseId).filter(Boolean);

    if (baseIds.length === 0) return;

    try {
      // Buscar equipamentos base
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: baseIds }),
      });
      if (!res.ok) {
        console.error("Erro ao buscar equipamentos base");
        return;
      }
      const equipmentBases = await res.json();

      // Buscar cartas base
      let cardBases: any[] = [];
      if (baseCardIds.length > 0) {
        const cardRes = await fetch("/api/cards/by-id", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: baseCardIds }),
        });
        if (cardRes.ok) {
          cardBases = await cardRes.json();
        } else {
          console.error("Erro ao buscar cartas base");
        }
      }

      const newEquipped: Record<string, EquippedItem> = {};

      for (const eq of equipments) {
        const base = equipmentBases.find((b: any) => b.id === eq.baseId);
        if (!base) continue;

        const slot = base.type;

        const cardsWithEffects = (eq.cards || []).map((cardFromBuild: any) => {
          const baseCard = cardBases.find((c) => c.id === cardFromBuild.baseId);
          if (!baseCard) return null;

          return {
            ...baseCard,
            effects: cardFromBuild.effectsOverride || baseCard.effects,
          };
        }).filter(Boolean);


        console.log('eq', eq)
        // Mapear as pedras do formato bruto para o formato esperado pelo frontend
        const stone = eq.stone?.dataOverride
          ? {
            stoneType: eq.stone.dataOverride.effect || "normal",
            displayValue: eq.stone.dataOverride.displayValue,
            value: eq.stone.dataOverride.value || 0,
            effectValueIndex: eq.stone.dataOverride.effectValueIndex,
            effectValueType: eq.stone.dataOverride.effectValueType,
            automaticEffects: eq.stone.dataOverride.automaticEffects || [],
            statusType: eq.stone.dataOverride.statusType,
          }
          : undefined;

        newEquipped[slot] = {
          ...base,
          selectedProps: eq.propsOverride || {},
          cards: cardsWithEffects,
          stone,
        };
      }

      setEquipped(newEquipped);
    } catch (error) {
      console.error("Erro na função setFullEquip:", error);
    }
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

  function calculateBonusExtras(): Record<string, Record<string, number>> {
    if (loadingBonusSets || errorBonusSets) return {};

    const counts = countAllBonusTypes();
    const bonusesByType: Record<string, Record<string, number>> = {};

    for (const bonusSet of bonusSets) {
      const { bonusType, bonuses } = bonusSet;
      const qty = counts[bonusType] || 0;

      if (!bonuses) continue;

      for (const tierStr in bonuses) {
        const tier = Number(tierStr);
        if (isNaN(tier) || qty < tier) continue; // só aplica até o nível atingido

        const tierBonuses = bonuses[tierStr];

        for (const stat in tierBonuses) {
          if (!bonusesByType[bonusType]) bonusesByType[bonusType] = {};
          bonusesByType[bonusType][stat] =
            (bonusesByType[bonusType][stat] || 0) + tierBonuses[stat];
        }
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


      // Usar stones (array) para permitir múltiplas pedras
      // Mas aqui só altera uma pedra simples (exemplo)
      // Se usar array, adapte conforme necessário
      return {
        ...prev,
        [slot]: {
          ...item,
          stone, // substitui pedras por uma só; ajuste se necessário
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
