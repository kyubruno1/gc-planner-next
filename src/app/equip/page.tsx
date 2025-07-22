"use client";

import { useCharacter } from "@/context/CharacterContext";
import { useEquip } from "@/context/EquipContext";
import { useState } from "react";

import { CharacterSelectModal } from "@/components/Characters/CharacterSelectModal/CharacterSelectModal";
import { SavedCharactersModal } from "@/components/Characters/SavedCharactersModal/SavedCharactersModal";
import { EquipOverview } from "@/components/Equip/EquipOverview/EquipOverview";
import { PageContainer } from "@/components/UI/PageContainer/PageContainer";

import { EquipGrid } from "@/components/Equip/EquipGrid";
import { SavedCharacter } from "@/context/CharacterContext";
import { toast } from "react-toastify";

export default function EquipPage() {

  const equipmentLeft = ['helmet', 'upper-armor', 'lower-armor', 'gloves', 'shoes', 'mantle'];
  const equipmentRight = ['weapon', 'upper-head', 'lower-head', 'upper-back', 'lower-back', 'arms', 'weapon-change', 'ring', 'necklace', 'bracelet', 'earring1', 'earring2'];

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
      {/* <div className="absolute inset-0 bg-[url('/assets/images/login.png')] bg-cover bg-center opacity-20 z-0" /> */}
      <PageContainer>
        {/* <EquipHeaderActions
          sheetName={sheetName}
          setSheetName={setSheetName}
          onSave={handleSaveCharacter}
          onOpenSaved={() => setIsSavedModalOpen(true)}
        /> */}


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