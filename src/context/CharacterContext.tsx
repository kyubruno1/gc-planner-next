'use client';

import { Character } from "@/types/character";
import { CharacterStatus } from "@/types/characterStatus";
import { EquippedItem } from "@/types/equip";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useAtkTotal } from "./AtkTotalContext";
import { useEquip } from "./EquipContext";

export interface FullCharacter {
  status: CharacterStatus;
  totalAttack: number;
  equipped: Record<string, EquippedItem>;
  combinedSetsEffect: Partial<CharacterStatus>;
}

export interface SavedCharacter {
  id: string;
  character: Character;
  jobKey: string;
  equipped: Record<string, EquippedItem>;
  savedAt: string;
  sheetName?: string;
  status?: CharacterStatus;
  totalAttack?: number;
  combinedSetsEffect?: any;
}

interface CharacterContextType {
  character: FullCharacter | null;
  setCharacter: React.Dispatch<React.SetStateAction<FullCharacter | null>>;
  selectedCharacter: Character | null;
  setSelectedCharacter: React.Dispatch<React.SetStateAction<Character | null>>;
  selectedJobKey: string | null;
  setSelectedJobKey: React.Dispatch<React.SetStateAction<string | null>>;
  sheetName: string;
  setSheetName: React.Dispatch<React.SetStateAction<string>>;
  saveCharacter: () => Promise<void>;
  reloadCharacter: () => void;
  savedCharacters: SavedCharacter[];
  fetchSavedCharacters: () => Promise<void>;
  removeCharacterFromSaved: (id: string) => Promise<void>;
  activeBuildId: string | null;
  setActiveBuildId: React.Dispatch<React.SetStateAction<string | null>>;
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export function CharacterProvider({ children }: { children: ReactNode }) {
  const { atkTotal, characterStatus } = useAtkTotal();
  const { equipped, calculateBonusExtras, setFullEquip } = useEquip();

  const [character, setCharacter] = useState<FullCharacter | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [selectedJobKey, setSelectedJobKey] = useState<string | null>(null);
  const [sheetName, setSheetName] = useState("Minha Build");
  const [savedCharacters, setSavedCharacters] = useState<SavedCharacter[]>([]);
  const [activeBuildId, setActiveBuildId] = useState<string | null>(null);

  useEffect(() => {
    console.log("equiped mudou:", equipped);
    reloadCharacter();
  }, [atkTotal, characterStatus, equipped]);

  useEffect(() => {
    fetchSavedCharacters();
  }, []);

  async function fetchSavedCharacters() {
    try {
      const res = await fetch("/api/builds");
      const data = await res.json();
      setSavedCharacters(data);
    } catch (error) {
      console.error("Erro ao buscar builds do banco:", error);
    }
  }

  async function reloadCharacter() {
    if (activeBuildId) {
      try {
        const res = await fetch(`/api/builds/${activeBuildId}`);
        if (!res.ok) throw new Error("Falha ao carregar build do banco");

        const data = await res.json();

        const bonusExtras = calculateBonusExtras();

        console.log(data.equipped)
        // Atualiza o estado da build com os dados vindos do banco
        setCharacter({
          status: data.status,
          totalAttack: data.totalAttack,
          equipped: data.equipped,
          combinedSetsEffect: data.combinedSetsEffect ?? bonusExtras,
        });


        // Reaplica equipamentos ao contexto
        await setFullEquip({ equipments: data.equipped });

      } catch (err) {
        console.error("Erro ao recarregar build do banco:", err);
      }
    } else {
      // fallback para builds não salvas
      if (!characterStatus) {
        setCharacter(null);
        return;
      }

      const bonusExtras = calculateBonusExtras();

      setCharacter({
        status: characterStatus,
        totalAttack: atkTotal,
        equipped,
        combinedSetsEffect: bonusExtras,
      });
    }
  }


  async function removeCharacterFromSaved(id: string) {
    setSavedCharacters((prev) => prev.filter((c) => c.id !== id));
    try {
      const res = await fetch(`/api/builds/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Erro ao deletar build");
      if (activeBuildId === id) setActiveBuildId(null);
      await fetchSavedCharacters();
    } catch (err) {
      console.error("Erro ao deletar build:", err);
    }
  }


  async function saveCharacter() {
    if (!character || !selectedCharacter || !selectedJobKey) return;

    const stoneBaseIdMap: Record<string, string> = {
      epic: "038e98e8-945c-4ba3-a855-e05d07ed109c",
      normal: "92ddd305-842c-47f4-a3fb-af72949b2c6a",
    };

    const equippedArray = Object.values(equipped).filter(equip => equip && equip.id);

    const equippedPayload = equippedArray.map(equip => {
      const cardsPayload = (equip.cards || [])
        .filter(card => !!card.id)
        .map(card => ({
          baseId: card.id,
          effectsOverride: card.effects ?? null,
        }));

      let stonePayload = null;

      console.log('equip', equip)
      if (equip.stone) {
        const stoneType = equip.stone.stoneType || equip.stone.stone;
        const baseId = stoneBaseIdMap[stoneType];

        if (baseId) {
          const {
            displayValue,
            value,
            effect,
            effectValue,
            effectValueIndex,
            effectValueType,
            statusType,
            automaticEffects,
          } = equip.stone;

          stonePayload = {
            baseId,
            dataOverride: {
              displayValue,
              value,
              effect,
              effectValue,
              effectValueIndex,
              effectValueType,
              statusType,
              automaticEffects,
            },
          };
        }
      }

      console.log('equip.stone', equip.stone)
      console.log('stonePayload', stonePayload)
      return {
        baseId: equip.id,
        propsOverride: equip.selectedProps || null,
        cards: cardsPayload,
        stone: stonePayload, // objeto ou null
      };
    });

    const payload = {
      characterId: selectedCharacter.id,
      jobKey: selectedJobKey,
      sheetName,
      totalAttack: character.totalAttack,
      status: character.status,
      equipped: equippedPayload,
    };

    try {
      const response = await fetch("/api/builds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro ao salvar build no banco:", errorText);
        return;
      }

      console.log("Build salva com sucesso!");
      await fetchSavedCharacters(); // atualiza lista local

    } catch (err) {
      console.error("Erro ao salvar personagem:", err);
    }
  }


  // async function saveCharacter() {
  //   if (!character || !selectedCharacter || !selectedJobKey) return;

  //   const stoneBaseIdMap: Record<string, string> = {
  //     epic: "038e98e8-945c-4ba3-a855-e05d07ed109c",
  //     normal: "92ddd305-842c-47f4-a3fb-af72949b2c6a",
  //   };

  //   const equippedArray = Object.values(equipped).filter(equip => equip && equip.id);

  //   const equippedPayload = equippedArray.map(equip => {
  //     const cardsPayload = (equip.cards || [])
  //       .filter(card => !!card.id)
  //       .map(card => ({
  //         baseId: card.id,
  //         effectsOverride: card.effects ?? null,
  //       }));

  //     let stonePayload = null;

  //     console.log('equip.stones', equip.stone)
  //     if (equip.stones) {
  //       const stoneType = equip.stones.stoneType || equip.stones.stone;
  //       const baseId = stoneBaseIdMap[stoneType];

  //       if (baseId) {
  //         const {
  //           displayValue,
  //           value,
  //           effect,
  //           effectValue,
  //           effectValueIndex,
  //           effectValueType,
  //           statusType,
  //           automaticEffects,
  //         } = equip.stones;

  //         stonePayload = {
  //           baseId,
  //           dataOverride: {
  //             displayValue,
  //             value,
  //             effect,
  //             effectValue,
  //             effectValueIndex,
  //             effectValueType,
  //             statusType,
  //             automaticEffects,
  //           },
  //         };
  //       }
  //     }

  //     return {
  //       baseId: equip.id,
  //       propsOverride: equip.selectedProps || null,
  //       cards: cardsPayload,
  //       stones: stonePayload,
  //     };
  //   });
  //   // const combinedSetsEffect = extractCombinedSetBonuses(equipped, bonusSets);

  //   const payload = {
  //     characterId: selectedCharacter.id,
  //     jobKey: selectedJobKey,
  //     sheetName,
  //     totalAttack: character.totalAttack,
  //     status: character.status,
  //     equipped: equippedPayload,
  //   };

  //   try {
  //     const response = await fetch("/api/builds", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(payload),
  //     });

  //     if (!response.ok) {
  //       const errorText = await response.text();
  //       console.error("Erro ao salvar build no banco:", errorText);
  //       return;
  //     }

  //     console.log("Build salva com sucesso!");

  //     await fetchSavedCharacters(); // atualiza lista local

  //   } catch (err) {
  //     console.error("Erro ao salvar personagem:", err);
  //   }
  // }


  return (
    <CharacterContext.Provider
      value={{
        character,
        setCharacter,
        selectedCharacter,
        setSelectedCharacter,
        selectedJobKey,
        setSelectedJobKey,
        sheetName,
        setSheetName,
        saveCharacter,
        reloadCharacter,
        savedCharacters,
        fetchSavedCharacters,
        removeCharacterFromSaved,
        activeBuildId,
        setActiveBuildId,
      }}
    >
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacter() {
  const context = useContext(CharacterContext);
  if (!context) throw new Error("useCharacter must be used within a CharacterProvider");
  return context;
}

