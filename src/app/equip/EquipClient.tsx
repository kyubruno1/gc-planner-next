"use client";

import { useCharacter } from "@/context/CharacterContext";
import { useEquip } from "@/context/EquipContext";
import { useEffect, useState } from "react";

import changeCharacter from "@/../public/assets/images/system/change_character.png";
import { CharacterSelectModal } from "@/components/CharacterSelectModal/CharacterSelectModal";
import { EquipOverview } from "@/components/EquipOverview/EquipOverview";
import { Items } from "@/components/Items/Items";
import { PageContainer } from "@/components/Page-container/Page-container";
import { SavedCharactersModal } from "@/components/SavedCharactersModal/SavedCharactersModal";
import { Status } from "@/components/Status/Status";

import { PresetButtonsEquip } from "@/components/PresetButtonsEquip/PresetButtonsEquip";
import { SavedCharacter } from "@/context/CharacterContext";
import Image from "next/image";
import { toast } from "react-toastify";

export function EquipClient() {
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

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(sheetName);

  useEffect(() => {
    setTempName(sheetName); // sempre que muda a build, atualiza o valor local
  }, [sheetName]);


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
        <div className={`${classes} flex gap-2 w-full flex-col `}>
          <label htmlFor="sheetNameInput" className="text-sm text-gray-600">
            Dê um título para a build:
          </label>
          {isEditingName ? (
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={() => {
                setSheetName(tempName.trim() || "Minha Build");
                setIsEditingName(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSheetName(tempName.trim() || "Minha Build");
                  setIsEditingName(false);
                }
              }}
              autoFocus
              className="text-lg font-semibold text-black border border-gray-400 rounded px-2 py-1 bg-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Digite o nome da build"
            />
          ) : (
            <span
              className="group inline-flex items-center gap-2 text-lg font-semibold text-black cursor-text px-2 py-1 border border-gray-300 rounded bg-gray-300 shadow-sm"
              title="Clique para editar o nome da build"
              onClick={() => setIsEditingName(true)}
            >
              {sheetName}
              <span className="text-gray-500 group-hover:text-yellow-600">🖉</span>
            </span>
          )}

          <button
            onClick={handleSaveCharacter}
            className=" bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded z-50"
          >
            Salvar Build
          </button>
          <button
            onClick={() => setIsSavedModalOpen(true)}
            className=" bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded z-50"
          >
            Abrir Builds Salvas
          </button>

          <PresetButtonsEquip />
        </div>


        <div className={classes}>
          <div className='grid grid-cols-[8.125rem_2fr_16.25rem] grid-rows-[auto_1fr_auto] gap-4 '>
            <div className="grid grid-flow-col grid-rows-6 gap-2.5 justify-start">
              {equipmentLeft.map((slot) => (
                <Items name={slot} key={slot} equipmentType="equip" />
              ))}
            </div>

            <div className="relative flex justify-center items-center">
              <button
                className="absolute top-2 right-2 z-2 cursor-pointer"
                onClick={() => setIsModalOpen(true)}
                aria-label="Change Character"
              >
                <Image src={changeCharacter} className='w-20 h-20 rounded-md' alt="Change Character" width={320} height={320} />
              </button>
              <Image
                width={960}
                height={800}
                priority
                src={characterImagePath}
                alt={`${characterName} - ${jobKey}`}
                className="object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/assets/images/characters/arts/elesis_first_job.png";
                }}
              />
            </div>

            <div className="grid grid-flow-col grid-rows-6 gap-2.5 justify-end">
              {equipmentRight.map((slot) => (
                <Items name={slot} key={slot} equipmentType="equip" />
              ))}
            </div>

            <Status />


          </div>
        </div>
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