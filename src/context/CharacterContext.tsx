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
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export function CharacterProvider({ children }: { children: ReactNode }) {
  const { atkTotal, characterStatus } = useAtkTotal();
  const { equipped, calculateBonusExtras } = useEquip();

  const [character, setCharacter] = useState<FullCharacter | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [selectedJobKey, setSelectedJobKey] = useState<string | null>(null);
  const [sheetName, setSheetName] = useState("Minha Build");

  useEffect(() => {
    reloadCharacter();
  }, [atkTotal, characterStatus, equipped]);

  function reloadCharacter() {
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

  async function saveCharacter() {
    if (!character || !selectedCharacter || !selectedJobKey) return;

    const payload = {
      characterId: selectedCharacter.id,
      jobKey: selectedJobKey,
      sheetName,
      totalAttack: character.totalAttack,
      status: character.status,
      combinedSetsEffect: character.combinedSetsEffect,
      equipped, // adaptado: deve ser serializado na API
    };

    try {
      const response = await fetch("/api/builds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error("Erro ao salvar build no banco");
      } else {
        console.log("Build salva com sucesso!");
      }
    } catch (err) {
      console.error("Erro ao salvar personagem:", err);
    }
  }

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
