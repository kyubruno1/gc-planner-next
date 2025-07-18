"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { useCharacter } from "@/context/CharacterContext";
import { useEquip } from "@/context/EquipContext";

import changeCharacter from "@/../public/assets/images/system/change_character.png";

import { Comments } from "@/components/Comments/Comments";
import { EquipOverview } from "@/components/EquipOverview/EquipOverview";
import { Items } from "@/components/Items/Items";
import { LikeButton } from "@/components/LikeButton/LikeButton";
import { PrintEquipModal } from "@/components/PrintEquipModal/PrintEquipModal";
import { Status } from "@/components/Status/Status";


interface EquipViewProps {
  savedBuild: any;
  readOnly?: boolean;
  userId?: string;
  buildId?: string;
  initialLiked?: boolean;
  initialComments?: any[];
  likeCount?: number;
}

export function EquipView({
  savedBuild,
  readOnly = true,
  userId,
  buildId,
  initialLiked = false,
  initialComments = [],
  likeCount = 0,
}: EquipViewProps) {
  const { setSelectedCharacter, setSelectedJobKey, setSheetName } = useCharacter();
  const { setFullEquip } = useEquip();

  const hasLoadedEquip = useRef(false);
  const [comments, setComments] = useState(initialComments);

  const [tempName, setTempName] = useState(savedBuild.sheetName || "Minha Build");
  const [isEditingName, setIsEditingName] = useState(false);

  const [incluirEquipOverview, setIncluirEquipOverview] = useState(true);
  const [incluirComentarios, setIncluirComentarios] = useState(true);

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  function finishEditingName() {
    const trimmed = tempName.trim() || "Minha Build";
    setSheetName(trimmed);
    setTempName(trimmed);
    setIsEditingName(false);
  }

  function openModal() {
    if (!readOnly) setIsModalOpen(true);
  }

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (savedBuild && !hasLoadedEquip.current) {
      setSelectedCharacter(savedBuild.character);
      setSelectedJobKey(savedBuild.jobKey);
      setSheetName(savedBuild.sheetName || "Minha Build");
      setFullEquip({ equipments: savedBuild.equipments });
      hasLoadedEquip.current = true;
    }
  }, [savedBuild]);

  return (
    <>
      {/* Painel de controle */}
      <div className="max-w-[1200px] mx-auto mt-6 p-4 bg-white rounded shadow-md border border-gray-300 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-4 items-center flex-wrap">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={incluirEquipOverview}
              onChange={() => setIncluirEquipOverview(!incluirEquipOverview)}
            />
            Incluir EquipOverview
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={incluirComentarios}
              onChange={() => setIncluirComentarios(!incluirComentarios)}
            />
            Incluir Comentários
          </label>
        </div>

        <button
          onClick={() => setIsPrintModalOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          📸 Abrir Modal de Print
        </button>
      </div>

      {/* ÁREA PRINCIPAL */}
      <div
        id="capture-area"
        className="gap-5 p-5 grid grid-cols-[20rem_1200px_1fr]"
      >
        {/* Título da build */}
        <div className="w-full mx-auto p-5 rounded border-4 shadow-dark-blue bg-bgpagelight border-primary mt-4 flex flex-col gap-5">
          <label htmlFor="sheetNameInput" className="text-sm text-gray-600">
            Título da Build:
          </label>

          {readOnly ? (
            <span className="text-lg font-semibold text-black px-2 py-1 bg-gray-300 rounded shadow-sm cursor-default">
              {savedBuild.sheetName || "Minha Build"}
            </span>
          ) : isEditingName ? (
            <input
              id="sheetNameInput"
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={finishEditingName}
              onKeyDown={(e) => e.key === "Enter" && finishEditingName()}
              autoFocus
              className="text-lg font-semibold text-black border border-gray-400 rounded px-2 py-1 bg-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ) : (
            <span
              className="group inline-flex items-center gap-2 text-lg font-semibold text-black cursor-text px-2 py-1 border border-gray-300 rounded bg-gray-300 shadow-sm"
              title="Clique para editar o nome da build"
              onClick={() => setIsEditingName(true)}
            >
              {savedBuild.sheetName || "Minha Build"}
              <span className="text-gray-500 group-hover:text-yellow-600">
                🖉
              </span>
            </span>
          )}

          {incluirEquipOverview && <EquipOverview />}

          {!readOnly && (
            <>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                Salvar Build
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                Abrir Builds Salvas
              </button>
            </>
          )}
        </div>

        {/* Equipamentos e personagem */}
        <div className="max-w-[1200px] mx-auto p-5 rounded border-4 shadow-dark-blue bg-bgpagelight border-primary mt-4 grid grid-cols-[8.125rem_2fr_16.25rem] grid-rows-[auto_1fr_auto] gap-4">
          <div className="grid grid-flow-col grid-rows-6 gap-2.5 justify-start">
            {[
              "helmet",
              "upper-armor",
              "lower-armor",
              "gloves",
              "shoes",
              "mantle",
            ].map((slot) => (
              <Items key={slot} name={slot} equipmentType="equip" readOnly />
            ))}
          </div>

          <div className="relative flex justify-center items-center">
            {!readOnly && (
              <button
                className="absolute top-2 right-2 z-20 cursor-pointer"
                onClick={openModal}
                aria-label="Change Character"
              >
                <Image
                  src={changeCharacter}
                  className="w-20 h-20 rounded-md"
                  alt="Change Character"
                />
              </button>
            )}
            <Image
              width={960}
              height={800}
              priority
              src={`/assets/images/characters/arts/${savedBuild.character.name}_${savedBuild.jobKey}.png`}
              alt={`${savedBuild.character.name} - ${savedBuild.jobKey}`}
              className="object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "/assets/images/characters/arts/elesis_first_job.png";
              }}
            />
          </div>

          <div className="grid grid-flow-col grid-rows-6 gap-2.5 justify-end">
            {[
              "weapon",
              "upper-head",
              "lower-head",
              "upper-back",
              "lower-back",
              "arms",
              "weapon-change",
              "ring",
              "necklace",
              "bracelet",
              "earring1",
              "earring2",
            ].map((slot) => (
              <Items key={slot} name={slot} equipmentType="equip" readOnly />
            ))}
          </div>

          <Status />
        </div>

        {/* Curtidas e comentários */}
        {userId && buildId && incluirComentarios && (
          <div className="max-w-[1200px] mx-auto p-5 rounded border-4 shadow-dark-blue bg-bgpagelight border-primary mt-4 gap-2 w-full">
            <div>
              <span>
                ❤️ {likeCount} {likeCount === 1 ? "curtida" : "curtidas"}
              </span>
            </div>
            <LikeButton
              userId={userId}
              buildId={buildId}
              initialLiked={initialLiked}
            />
            <Comments
              userId={userId}
              buildId={buildId}
              initialComments={comments}
              onCommentsUpdate={setComments}
            />
          </div>
        )}
      </div>

      {/* Modal para print */}
      {isPrintModalOpen && (
        <PrintEquipModal onClose={() => setIsPrintModalOpen(false)} savedBuild={savedBuild} />
      )}
    </>
  );
}