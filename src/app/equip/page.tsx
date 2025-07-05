"use client";

import { useCharacter } from "@/context/CharacterContext";
import { useEquip } from "@/context/EquipContext";
import { useState } from "react";

import changeCharacter from "@/../public/assets/images/system/change_character.png";
import { CharacterSelectModal } from "@/components/CharacterSelectModal/CharacterSelectModal";
import { Header } from "@/components/Header/Header";
import { Items } from "@/components/Items/Items";
import { PageContainer } from "@/components/Page-container/Page-container";
import { Status } from "@/components/Status/Status";
// import { EquipOverview } from "@/EquipOverview";

// import { SavedCharacter, useSavedCharacters } from "@/hooks/useSavedCharacters";

// import "@/global.css";
import Image from "next/image";
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
    saveCharacter,
  } = useCharacter();

  const { equipped, setFullEquip } = useEquip();
  // const { savedCharacters, removeCharacter, reloadSavedCharacters } = useSavedCharacters();

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

    // saveCharacter(undefined, () => {
    //   reloadSavedCharacters();
    //   toast.success("Personagem salvo com sucesso!", {
    //     icon: <img src="/assets/images/system/elena_success.png" alt="Sucesso" className="w-6 h-6" />,
    //   });
    // });
  }

  function handleLoadCharacter(saved: SavedCharacter) {
    setSelectedCharacter(saved.character);
    setSelectedJobKey(saved.jobKey);
    setFullEquip(saved.equipped);
    setIsSavedModalOpen(false);
  }

  function handleDeleteCharacter(id: string) {
    if (window.confirm("Tem certeza que deseja deletar esse personagem salvo?")) {
      // removeCharacter(id);
      toast.success("Personagem deletado com sucesso!", {
        icon: <Image src="/assets/images/system/elena_success.png" alt="Sucesso" className="w-6 h-6" width={6} height={6} />,
      });
    }
  }

  return (
    <>
      <Header />
      <PageContainer>
        <div className='grid grid-cols-[8.125rem_2fr_16.25rem] grid-rows-[auto_1fr_auto] gap-4 '>
          <div className="grid grid-flow-col grid-rows-6 gap-2.5 justify-start">
            {equipmentLeft.map((slot) => (
              <Items name={slot} key={slot} equipmentType="equip" />
            ))}
          </div>

          <div className="relative flex justify-center items-center">
            <button
              className="absolute top-2 right-2 z-10"
              onClick={() => setIsModalOpen(true)}
              aria-label="Change Character"
            >
              <Image src={changeCharacter} className='w-20 h-20 rounded-md' alt="Change Character" width={320} height={320} />
            </button>
            <Image
              width={960}
              height={800}
              src={characterImagePath}
              alt={`${characterName} - ${jobKey}`}
              className="w-[60.25rem] h-[50rem] object-contain"
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

          <div className="flex gap-2 mb-4 w-full col-span-3">
            <button
              onClick={handleSaveCharacter}
              className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded z-50"
            >
              Salvar Build
            </button>

            <button
              onClick={() => setIsSavedModalOpen(true)}
              className="w-1/2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded z-50"
            >
              Abrir Builds Salvas
            </button>
          </div>

          <div className='mt-8 text-white p-4 space-y-4 col-span-3 bg-gray-900 rounded-xl'>
            <h2 className="text-xl font-semibold">Bônus de Set Ativos:</h2>
            <ul className="list-disc pl-6 space-y-1">
              {Object.entries(bonusExtras).map(([key, stats]) => (
                <li key={key}>
                  <strong>{key}:</strong>
                  <ul className="list-circle pl-4">
                    {Object.entries(stats).map(([statKey, statValue]) => (
                      <li key={statKey}>
                        {statKey}: {statValue}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>

          <div />

          {/* <EquipOverview /> */}
        </div>
      </PageContainer>

      {isModalOpen && <CharacterSelectModal onClose={() => setIsModalOpen(false)} />}
      {/* {isSavedModalOpen && (
        <SavedCharactersModal
          onClose={() => setIsSavedModalOpen(false)}
          savedCharacters={savedCharacters}
          onLoadCharacter={handleLoadCharacter}
          onDeleteCharacter={handleDeleteCharacter}
        />
      )} */}
    </>
  );
}
