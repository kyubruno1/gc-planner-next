"use client";

import { Items } from "@/components/Equip/Items/Items";
import { toPng } from 'html-to-image';
import Image from "next/image";
import { useRef, useState } from "react";
import { AwakeningSkillTree } from "../AwakeningSkillTree";
import { HeroCollectionPrint } from "../HeroCollectionPrint";
import { Status } from "../Status/Status";
import { TEMPORARYRunes } from "../TEMPORARY-runes";
import { CardCollectionLevel } from "./CardCollectionLevel";
import { EquipOverview } from "./EquipOverview";

export function PrintEquipModal({ onClose, savedBuild }: { onClose: () => void; savedBuild: any }) {
  const captureRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Estados para controlar o que mostrar/ocultar
  const [showEquip, setShowEquip] = useState(true);
  const [showTitle, setShowTitle] = useState(true);
  const [showPet, setShowPet] = useState(true);
  const [showAwakening, setShowAwakening] = useState(true);
  const [showHeroCollection, setShowHeroCollection] = useState(false);
  const [showVisualChase, setShowVisualChase] = useState(false);
  const [showCardCollection, setShowCardCollection] = useState(true);
  const [showRunes, setShowRunes] = useState(true);
  const [showStatus, setShowStatus] = useState(true);
  const [showEquipOverview, setShowEquipOverview] = useState(true);

  async function handleSaveImage() {
    if (!captureRef.current) return;

    const el = captureRef.current;

    try {
      setIsSaving(true);

      // Remover restrições temporariamente para print completo
      const originalStyle = {
        height: el.style.height,
        maxHeight: el.style.maxHeight,
        overflow: el.style.overflow,
        width: el.style.width,
        maxWidth: el.style.maxWidth,
      };

      el.style.height = "auto";
      el.style.maxHeight = "none";
      el.style.overflow = "visible";
      el.style.width = "auto";
      el.style.maxWidth = "none";

      await new Promise((r) => setTimeout(r, 100));

      const dataUrl = await toPng(el, {
        cacheBust: true,
        pixelRatio: 1,
        width: el.scrollWidth,
        height: el.scrollHeight,
        style: {
          overflow: "visible",
        },
      });

      // Restaurar estilos
      Object.assign(el.style, originalStyle);
      el.classList.remove("safe-colors");

      const link = document.createElement("a");
      link.download = "equip_overview.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Erro ao gerar imagem:", err);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-primary rounded-lg p-6 max-h-[90vh] overflow-auto w-[1200px]"
        onClick={(e) => e.stopPropagation()}
      >

        {/* SECTION PARA ESCOLHER O QUE EXCLUIR */}
        <section className="mb-6 bg-bgpagelight rounded p-4 shadow-dark-blue border border-primary text-white text-shadow-title">

          <h3 className="text-2xl font-semibold mb-3 text-gold text-center mb-4">Selecione o que quer na imagem</h3>
          <div className="grid grid-cols-4 gap-3 ">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={showEquip} onChange={() => setShowEquip(!showEquip)} />
              Equipamentos
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={showTitle} onChange={() => setShowTitle(!showTitle)} />
              Título
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={showPet} onChange={() => setShowPet(!showPet)} />
              Pet
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={showAwakening} onChange={() => setShowAwakening(!showAwakening)} />
              Despertar
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={showHeroCollection} onChange={() => setShowHeroCollection(!showHeroCollection)} />
              Coleção de Heróis
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={showVisualChase} onChange={() => setShowVisualChase(!showVisualChase)} />
              Coleção Visual Chase
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={showCardCollection} onChange={() => setShowCardCollection(!showCardCollection)} />
              Coleção (Card Collection)
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={showRunes} onChange={() => setShowRunes(!showRunes)} />
              Runas
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={showStatus} onChange={() => setShowStatus(!showStatus)} />
              Status
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={showEquipOverview} onChange={() => setShowEquipOverview(!showEquipOverview)} />
              Equip Overview
            </label>
          </div>
          {/* BOTÕES */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={handleSaveImage}
              disabled={isSaving}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? "Salvando..." : "Salvar Imagem"}
            </button>
            <button
              onClick={onClose}
              className="bg-gray-400 text-black px-4 py-2 rounded hover:bg-gray-500"
            >
              Fechar
            </button>
          </div>
        </section>

        {/* CONTEÚDO QUE SERÁ IMPRESSO */}
        <div ref={captureRef} className="bg-primary">

          {/* ICONE PERSONAGEM */}
          <div className="relative rounded border-4 my-4 shadow-dark-blue border-primary overflow-hidden">
            <div className="absolute inset-0 bg-[url('/assets/images/grandchase.jpg')] bg-center bg-[length:70%_350px]" />
            <div className="absolute inset-0 bg-black/80 " />

            <div className="relative grid grid-cols-2 gap-4 items-center p-4 text-white">
              <div className="flex justify-center">
                <Image
                  src={`/assets/images/characters/icon-characters/${savedBuild.character.name.toLowerCase()}.webp`}
                  alt={savedBuild.character.name}
                  className="w-24 h-24 object-cover rounded"
                  onError={(e) =>
                  ((e.currentTarget as HTMLImageElement).src =
                    "/assets/images/characters/arts/elesis_first_job.png")
                  }
                  height={96}
                  width={96}
                />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gold text-shadow-title">
                  {savedBuild.sheetName || "Minha Build"}
                </h2>
                <p className="text-lg mt-1 text-shadow-lg ">
                  por {savedBuild.user?.name || "usuário desconhecido"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6  justify-center content-center">

            {/* EQUIPAMENTOS */}
            {showEquip && (
              <div>
                <div className="grid grid-cols-3 gap-2 py-4 justify-items-center rounded border-4 shadow-dark-blue bg-bgpagelight border-primary">
                  {[
                    "helmet",
                    "weapon",
                    "weapon-change",
                    "upper-armor",
                    "upper-head",
                    "ring",
                    "lower-armor",
                    "lower-head",
                    "necklace",
                    "gloves",
                    "upper-back",
                    "bracelet",
                    "shoes",
                    "lower-back",
                    "earring1",
                    "mantle",
                    "arms",
                    "earring2",
                  ].map((slot) => (
                    <Items key={slot} name={slot} equipmentType="equip" readOnly />
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4 w-full justify-between">

              {/* TÍTULO */}
              {showTitle && (
                <div className="grid grid-cols-[120px_1fr] rounded border-y-4  p-4 shadow-dark-blue bg-bgpagelight border-primary">
                  <div>
                    <Image
                      className="bg-bghovermodal p-2 rounded-lg "
                      src="/assets/images/titles/apocalipse.png"
                      alt=""
                      width={100}
                      height={100}
                    />
                  </div>
                  <div className="flex align-middle items-center">
                    <h4 className="text-2xl font-bold text-white text-shadow-title">Nome do título</h4>
                  </div>
                </div>
              )}

              {/* PET */}
              {showPet && (
                <div className="grid grid-cols-[120px_1fr] rounded border-y-4  p-4 shadow-dark-blue bg-bgpagelight border-primary">
                  <div>
                    <Image
                      className="bg-bghovermodal p-2 rounded-lg "
                      src="/assets/images/PET.png"
                      alt=""
                      width={100}
                      height={100}
                    />
                  </div>
                  <div className="flex align-middle items-center">
                    <h4 className="text-2xl font-bold text-white text-shadow-title">Pet LV 40.</h4>
                  </div>
                </div>
              )}

              {/* DESPERTAR */}
              {showAwakening && (
                <div className="rounded border-4 shadow-dark-blue bg-bgpagelight border-bghovermodal">
                  <AwakeningSkillTree backgroundCharacter={savedBuild.character.name} />
                </div>
              )}
            </div>

            {/* COLEÇÃO DE HERÓIS */}
            {showHeroCollection && (
              <div className="col-span-2">
                <h3 className="text-2xl font-bold text-gold text-shadow-title">Coleção de Heróis</h3>
                <div className="rounded border-4 shadow-dark-blue bg-bgpagelight border-primary ">
                  <HeroCollectionPrint />
                </div>
              </div>
            )}

            {/* COLEÇÃO DE VISUAL CHASE */}
            {showVisualChase && (
              <div className="col-span-2">
                <h3 className="text-2xl font-bold text-gold text-shadow-title">Coleção de Visual Chase</h3>
                <div className="rounded border-4 shadow-dark-blue bg-bgpagelight border-primary ">
                  <HeroCollectionPrint />
                </div>
              </div>
            )}

            {/* COLEÇÃO (CardCollectionLevel) */}
            {showCardCollection && (
              <div className="mb-4 rounded border-4 shadow-dark-blue bg-bgpagelight border-primary flex justify-center items-center">
                <CardCollectionLevel collectionLevel={642} />
              </div>
            )}

            {/* RUNAS */}
            {showRunes && (
              <div className="mb-4 rounded border-4 shadow-dark-blue bg-bgpagelight border-primary flex justify-center items-center">
                <TEMPORARYRunes />
              </div>
            )}
          </div>

          {/* STATUS */}
          {showStatus && <Status />}

          {/* Detalhes Equip Overview */}
          {showEquipOverview && (
            <div className="mt-10">
              <h3 className="font-bold text-2xl text-gold text-shadow-title border-t border-black text-center pt-4">
                Detalhes da build
              </h3>
              <EquipOverview />
            </div>
          )}

        </div>



      </div>
    </div>
  );
}
