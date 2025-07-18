"use client";

import { EquipOverview } from "@/components/EquipOverview/EquipOverview";
import { Items } from "@/components/Items/Items";
import { toPng } from 'html-to-image'; // substitui html2canvas
import { useRef, useState } from "react";

export function PrintEquipModal({ onClose, savedBuild }: { onClose: () => void; savedBuild: any }) {
  const captureRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);

  console.log(savedBuild);
  async function handleSaveImage() {
    if (!captureRef.current) return;

    const el = captureRef.current;

    try {
      setIsSaving(true);
      el.classList.add("safe-colors");

      // Remover restrições de tamanho temporariamente
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
        // backgroundColor: "#ffffff",
        pixelRatio: 2,
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
      el.classList.remove("safe-colors");
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
        className="bg-primary rounded-lg p-6 w-full max-w-xl max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
        ref={captureRef}
      >
        <div className="rounded border-4 my-4 shadow-dark-blue bg-bgpagelight border-primary">
          <div className="grid grid-cols-2 gap-4 items-center p-4">
            {/* Coluna 1: imagem do personagem */}
            <div className="flex justify-center">
              <img
                src={`/assets/images/characters/arts/${savedBuild.character.name}_${savedBuild.jobKey}.png`}
                alt={savedBuild.character.name}
                className="w-24 h-24 object-cover rounded-full border-2 border-white"
                onError={(e) =>
                ((e.currentTarget as HTMLImageElement).src =
                  "/assets/images/characters/arts/elesis_first_job.png")
                }
              />
            </div>

            {/* Coluna 2: nome da build e username */}
            <div>
              <h2 className="text-2xl font-bold text-white">
                {savedBuild.sheetName || "Minha Build"}
              </h2>
              <p className="text-sm text-gray-300 mt-1">
                por {savedBuild.user?.username || "usuário desconhecido"}
              </p>
            </div>
          </div>
        </div>
        {/* <h2 className="text-xl font-bold mb-4">Equipamentos e Overview</h2> */}

        <div className="grid grid-cols-1 gap-6 rounded border-4 shadow-dark-blue bg-bgpagelight border-primary justify-center items-center content-center">
          <div>
            {/* <h3 className="font-semibold mb-2">Equipamentos</h3> */}
            <div className="grid grid-cols-3 gap-4 justify-items-center">
              {[
                "helmet",
                "upper-armor",
                "lower-armor",
                "gloves",
                "shoes",
                "mantle",
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
          </div>

          <div>
            <h3 className="font-semibold mb-2">Equip Overview</h3>
            <EquipOverview />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
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
      </div>
    </div>
  );
}
