"use client";

import { useCharacter } from "@/context/CharacterContext";
import { useEquip } from "@/context/EquipContext";
import { useState } from "react";

import { CharacterSelectModal } from "@/components/Characters/CharacterSelectModal";
import { SavedCharactersModal } from "@/components/Characters/SavedCharactersModal";
import { EquipOverview } from "@/components/Equip/EquipOverview";
import { PageContainer } from "@/components/ui/PageContainer";

import { EquipGrid } from "@/components/Equip/EquipGrid";
import { EquipHeaderActions } from "@/components/Equip/HeaderEquipActions";
import { PlannerHeader } from "@/components/Header/Header";
import { Button } from "@/components/ui/Button";
import { SavedCharacter } from "@/context/CharacterContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { toast } from "react-toastify";

export default function EquipPage() {

  const equipmentLeft = [
    { name: 'helmet', equipmentType: 'armor_set' },
    { name: 'upper-armor', equipmentType: 'armor_set' },
    { name: 'lower-armor', equipmentType: 'armor_set' },
    { name: 'gloves', equipmentType: 'armor_set' },
    { name: 'shoes', equipmentType: 'armor_set' },
    { name: 'mantle', equipmentType: 'armor_set' },
  ];

  const equipmentRight = [
    { name: 'weapon', equipmentType: 'armor_set' },
    { name: 'upper-head', equipmentType: 'accessories_set' },
    { name: 'lower-head', equipmentType: 'accessories_set' },
    { name: 'upper-back', equipmentType: 'accessories_set' },
    { name: 'lower-back', equipmentType: 'accessories_set' },
    { name: 'arms', equipmentType: 'accessories_set' },
    { name: 'weapon-change', equipmentType: 'armor_set' },
    { name: 'ring', equipmentType: 'accessories_set' },
    { name: 'necklace', equipmentType: 'accessories_set' },
    { name: 'bracelet', equipmentType: 'accessories_set' },
    { name: 'earring1', equipmentType: 'accessories_set' },
    { name: 'earring2', equipmentType: 'accessories_set' },
  ];


  const {
    selectedCharacter,
    selectedJobKey,
    setSelectedCharacter,
    setSelectedJobKey,
    character,
    sheetName,
    setSheetName,
    setActiveBuildId,
    saveCharacter,
    reloadCharacter,
  } = useCharacter();

  const { equipped, setFullEquip } = useEquip();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);

  const characterName = selectedCharacter?.name || "elesis";
  const jobKey = selectedJobKey || "first_job";
  const characterImagePath = `/assets/images/characters/arts/${characterName}_${jobKey}.png`;
  const bonusExtras = character?.combinedSetsEffect || {};


  function handleSaveCharacter() {
    if (!selectedCharacter || !selectedJobKey) {
      toast.error("Selecione um personagem e uma classe antes de salvar.", {
        icon: <img src="/assets/images/system/elena-fail.png" alt="Falha" className="w-6 h-6" />,
      });
      return;
    }

    saveCharacter().then(() => {
      toast.success("Build salva com sucesso!", {
        icon: <img src="/assets/images/system/elena_success.png" alt="Sucesso" className="w-6 h-6" />,
      });
    });
  }

  function handleLoadCharacter(saved: SavedCharacter) {
    setSelectedCharacter(saved.character);
    setSelectedJobKey(saved.jobKey);
    setSheetName(saved.sheetName || "Minha Build");
    setFullEquip(saved.equipped);
    setActiveBuildId(saved.id);
    reloadCharacter();
  }


  const baseClasses = "gap-5 p-5 max-w-[1200px] mx-auto rounded-[10px] border-4 shadow-dark-blue";
  const lightClasses = "bg-bgpagelight border-primary";
  // const darkClasses = "bg-bgdarkblue border-primary";
  const classes = `${baseClasses} ${lightClasses}`;

  return (
    <>
      <div className="flex px-5 mb-[-1rem]">
        <PlannerHeader />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="ml-5 mt-4 w-30">Presets</Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="p-4 w-140 z-[1000]">
            <EquipHeaderActions
              sheetName={sheetName}
              setSheetName={setSheetName}
              onSave={handleSaveCharacter}
              onOpenSaved={() => setIsSavedModalOpen(true)}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <PageContainer>

        <EquipGrid
          equipmentLeft={equipmentLeft}
          equipmentRight={equipmentRight}
          characterImagePath={characterImagePath}
          onOpenCharacterModal={() => setIsModalOpen(true)}
        />

        <div className={`${classes} gap-2 w-full`}>
          <EquipOverview />
        </div>

      </PageContainer>

      {isModalOpen && <CharacterSelectModal onClose={() => setIsModalOpen(false)} />}

      {isSavedModalOpen && (
        <SavedCharactersModal
          onClose={() => setIsSavedModalOpen(false)}
          onLoadCharacter={handleLoadCharacter}
        />
      )}
    </>
  );
}