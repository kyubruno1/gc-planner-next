"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { CharacterStatus, emptyCharacterStatus } from "../types/characterStatus";
import { useEquip } from "./EquipContext";

interface AtkTotalContextType {
  atkTotal: number;
  characterStatus: CharacterStatus | null;
  addSource: (id: string, status: Partial<CharacterStatus>) => void;
  removeSource: (id: string) => void;
  clearSources: () => void;
}

const AtkTotalContext = createContext<AtkTotalContextType | undefined>(undefined);

export function AtkTotalProvider({ children }: { children: ReactNode }) {
  const { equipped, calculateBonusExtras, flattenBonusExtras } = useEquip();

  const statusBase: CharacterStatus = {
    total_attack: 0,
    attack: 300,
    crit_chance: 0,
    crit_damage: 0,
    sp_attack: 0,
    mp_rec: 0,
    hell_spear_chance: 10.0,
    hell_spear: 0,
    taint_resistance: 0,
    defense: 260,
    hp: 190,
    crit_resistance: 0,
    sp_def: 0,
    hp_rec: 0,
    counter_attack_resistance: 0,
    exp: 0,
    gp: 0,
  };

  const [sources, setSources] = useState<Record<string, Partial<CharacterStatus>>>({ base: statusBase });
  const [characterStatus, setCharacterStatus] = useState<CharacterStatus>(statusBase);
  const [atkTotal, setAtkTotal] = useState<number>(calculateAtkTotal(statusBase));

  function normalizeCharacterStatus(partial: Partial<CharacterStatus>): CharacterStatus {
    return { ...emptyCharacterStatus, ...partial };
  }

  function sumSources(sources: Record<string, Partial<CharacterStatus>>): CharacterStatus {
    return Object.values(sources).reduce((acc, cur) => {
      const norm = normalizeCharacterStatus(cur);
      for (const key in acc) {
        acc[key as keyof CharacterStatus] += norm[key as keyof CharacterStatus];
      }
      return acc;
    }, { ...emptyCharacterStatus });
  }

  function calculateAtkTotal(character: CharacterStatus): number {
    const {
      attack,
      crit_chance,
      crit_damage,
      sp_attack,
      mp_rec,
      defense: def,
      sp_def,
      hp,
      hp_rec,
    } = character;

    return (
      ((1 - crit_chance / 100) + (crit_chance / 100) * (1.2 + crit_damage / 100)) *
      ((attack * 27 + (attack + sp_attack) * 20 * (1 + mp_rec / 100)) / 33.75) +
      0.7 * (def + sp_def / 5 + hp * (1 + hp_rec / 100))
    );
  }

  function addSource(id: string, status: Partial<CharacterStatus>) {
    setSources((prev) => ({
      ...prev,
      [id]: status,
    }));
  }

  function removeSource(id: string) {
    if (id === "base") return;
    setSources((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  }

  function clearSources() {
    setSources({ base: statusBase });
  }

  function extractStatusFromEquipments(): Record<string, Partial<CharacterStatus>> {
    const extracted: Record<string, Partial<CharacterStatus>> = {};

    function extractCardEffects(card: { effects: { name: string; value: number }[] }) {
      const effectsObj: Partial<CharacterStatus> = {};
      for (const effect of card.effects) {
        effectsObj[effect.name as keyof CharacterStatus] =
          (effectsObj[effect.name as keyof CharacterStatus] || 0) + effect.value;
      }
      return effectsObj;
    }

    for (const slot in equipped) {
      const item = equipped[slot];
      extracted[`equip:${slot}`] = normalizeCharacterStatus(item);

      if (item.cards) {
        item.cards.forEach((card, index) => {
          extracted[`equip:${slot}:card${index}`] = normalizeCharacterStatus(extractCardEffects(card));
        });
      }

      if (item.selectedProps) {
        extracted[`equip:${slot}:props`] = normalizeCharacterStatus(item.selectedProps);
      }
    }

    return extracted;
  }

  // Atualiza status dos equips e bônus, preservando pedras
  useEffect(() => {
    const bonusSets = calculateBonusExtras();
    const flatBonus = flattenBonusExtras(bonusSets);
    const normalizedBonus = normalizeCharacterStatus(flatBonus);

    const sourcesFromEquip = extractStatusFromEquipments();

    setSources((prev) => {
      const stones = Object.fromEntries(
        Object.entries(prev).filter(([key]) => key.startsWith("stone:"))
      );

      return {
        base: statusBase,
        ...sourcesFromEquip,
        "bonusSet:all": normalizedBonus,
        ...stones,
      };
    });
  }, [equipped]);

  // Sempre que as fontes mudarem, recalcula tudo
  useEffect(() => {
    const summed = sumSources(sources);
    setCharacterStatus(summed);
    setAtkTotal(calculateAtkTotal(summed));
  }, [sources]);

  return (
    <AtkTotalContext.Provider
      value={{
        atkTotal,
        characterStatus,
        addSource,
        removeSource,
        clearSources,
      }}
    >
      {children}
    </AtkTotalContext.Provider>
  );
}

export function useAtkTotal() {
  const context = useContext(AtkTotalContext);
  if (!context) throw new Error("useAtkTotal deve ser usado dentro de AtkTotalProvider");
  return context;
}
