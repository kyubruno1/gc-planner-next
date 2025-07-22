import Tippy from "@tippyjs/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "tippy.js/dist/tippy.css";

import { BaseModal } from "@/components/UI/BaseModal/BaseModal";
import { statusLabels } from "@/utils/statusLabels";
import Image from "next/image";
import { Effect, StoneType } from "../../../types/stones";
import { StonesModalProps } from "./StonesModal.types";

export function StonesModal({ onClose, isAncient, slotName, initialValue, onApply, stoneData }: StonesModalProps) {
  const [showStones, setShowStones] = useState(true);
  const [activeStone, setActiveStone] = useState<StoneType | null>(
    initialValue?.stone || null
  );
  const [selectedEffect, setSelectedEffect] = useState<string | null>(
    initialValue?.effect || null
  );
  const [effectValueIndex, setEffectValueIndex] = useState<number>(
    initialValue?.effectValueIndex ?? 0
  );
  const [stoneValueSelected, setStoneValueSelected] = useState<number | null>(
    initialValue?.value ?? null
  );

  const currentStoneData = activeStone
    ? stoneData.find((s) => s.stoneType === activeStone)
    : null;


  const stoneInfo = currentStoneData?.data[slotName];

  const stoneKeys = Object.keys(stoneInfo || {})
    .filter((k) => {
      if (["type", "special_effects"].includes(k)) return false;
      if (!isAncient && k === "18") return false;
      return true;
    })
    .sort((a, b) => Number(a) - Number(b));

  const specialEffectsDefault: Effect[] = stoneInfo?.special_effects?.default || [];
  const specialEffectsAncient: Effect[] = stoneInfo?.special_effects?.ancient || [];
  const specialEffectsExtra18: Effect[] = stoneInfo?.special_effects?.["18"] || [];

  const currentEffects = isAncient ? specialEffectsAncient : specialEffectsDefault;

  function handleStoneClick(stone: StoneType) {
    if (activeStone === stone) {
      setActiveStone(null);
      setSelectedEffect(null);
      setEffectValueIndex(0);
      setStoneValueSelected(null);
    } else {
      setActiveStone(stone);
      setSelectedEffect(null);
      setEffectValueIndex(0);
      setStoneValueSelected(null);
    }
  }

  function handleValueSelect(value: number) {
    if (!activeStone) return;

    if (activeStone === "epic" && !selectedEffect) {
      toast.error("Selecione um efeito especial para a pedra épica.", {
        icon: (
          <Image
            src="/assets/images/system/elena-fail.png"
            alt="Falha"
            width={24}
            height={24}
          />
        ),
      });
      return;
    }

    setStoneValueSelected(value);

    const effectData = currentEffects.find((e) => e.name === selectedEffect);

    const effectValue = effectData?.values[effectValueIndex] ?? undefined;
    const effectValueType = (effectData?.valueType as "percent" | "flat") ?? "flat";

    if (!stoneInfo?.type) {
      toast.error("Tipo da pedra não definido!", {
        icon: (
          <Image
            src="/assets/images/system/elena-fail.png"
            alt="Falha"
            width={24}
            height={24}
          />
        ),
      });
      return;
    }

    const automaticEffects = value === 18 ? specialEffectsExtra18 : [];

    onApply(slotName, {
      stone: activeStone,
      displayValue: value,
      value: stoneInfo?.[value],
      effect: selectedEffect ?? undefined,
      effectValueIndex,
      effectValue,
      effectValueType,
      automaticEffects,
      statusType: stoneInfo?.type || "",
    });

    setShowStones(false);
    setActiveStone(null);
    setSelectedEffect(null);
    setEffectValueIndex(0);
    setStoneValueSelected(null);
  }

  useEffect(() => {
    if (selectedEffect && !currentEffects.some((e) => e.name === selectedEffect)) {
      setSelectedEffect(null);
      setEffectValueIndex(0);
    }
  }, [stoneValueSelected, currentEffects, selectedEffect]);

  return (
    <BaseModal onClose={onClose} title="Pedra de fortificação" titleColor="text-purple-500">
      <div className="flex flex-col gap-4 items-center p-4">
        <p className="text-lightgray text-outline-lg">Escolha uma das pedras de fortificação.</p>
        {showStones && (
          <div className="flex gap-8 ">
            {/* Pedra Normal */}
            <div className="flex flex-col items-center bg-gradient-to-b from-bluecustom to-bgtextdark p-4 rounded-md shadow-bluecustom">
              <Image
                src="/assets/images/system/normal_stone.png"
                alt="Normal Stone"
                onClick={() => handleStoneClick("normal")}
                unoptimized
                width={80}
                height={80}
                className="w-auto h-auto cursor-pointer rounded-lg"
              />
              <p className="text-lightgray p-4 font-bold text-outline-lg text-xl">
                Pedra de Fortificação (normal)
              </p>
              {activeStone === "normal" && stoneInfo && (
                <div className="flex items-center justify-center text-center flex-wrap gap-1 mt-2 max-w-xs p-2 bg-gradient-to-b from-bgtextdark to-bluecustom border-primary rounded-md border-[5px]">
                  {stoneKeys.map((key) => (
                    <Tippy key={key} content={`${statusLabels[stoneInfo.type]} +${stoneInfo[key]}`} arrow={true}>
                      <button
                        onClick={() => handleValueSelect(Number(key))}
                        className={`w-8 h-8 px-2 py-1 flex items-center justify-center border rounded transition transform duration-150 ease-in-out 
                        ${stoneValueSelected === Number(key) && activeStone === "normal"
                            ? "bg-blue-300"
                            : "bg-white hover:bg-gray-200 hover:-translate-y-1"
                          }`}
                      >
                        {key}
                      </button>
                    </Tippy>
                  ))}
                </div>
              )}
            </div>

            {/* Pedra Épica */}
            <div className="flex flex-col items-center bg-gradient-to-b from-bluecustom to-bgtextdark p-4 rounded-md shadow-bluecustom">
              <Image
                src="/assets/images/system/epic_stone.png"
                alt="Epic Stone"
                className="w-auto h-auto cursor-pointer rounded-lg"
                onClick={() => handleStoneClick("epic")}
                unoptimized
                width={80}
                height={80}
              />
              <p className="text-gold p-4 font-bold text-outline-lg text-xl">
                Pedra de Fortificação (Épica)
              </p>
              {activeStone === "epic" && stoneInfo && (
                <div className="flex flex-col gap-3 mt-2 max-w-xs p-2 bg-gradient-to-b from-bgtextdark to-bluecustom border-primary rounded-md border-[5px]">
                  <div className="flex flex-wrap gap-1 justify-center text-center">
                    {stoneKeys.map((key) => (
                      <Tippy key={key} content={`${statusLabels[stoneInfo.type]} +${stoneInfo[key]}`} arrow={true}>
                        <button
                          onClick={() => handleValueSelect(Number(key))}
                          className={`w-8 h-8 px-2 py-1 flex items-center justify-center border rounded transition transform duration-150 ease-in-out
                            ${stoneValueSelected === Number(key) && activeStone === "epic"
                              ? "bg-blue-300"
                              : "bg-white hover:bg-gray-200 hover:-translate-y-1"
                            }`}
                        >
                          {key}
                        </button>
                      </Tippy>
                    ))}
                  </div>

                  <label className="text-sm font-medium text-white">Efeito Especial:</label>
                  <select
                    className="p-1 border rounded text-sm"
                    value={selectedEffect ?? ""}
                    onChange={(e) => {
                      setSelectedEffect(e.target.value || null);
                      setEffectValueIndex(0);
                    }}
                  >
                    <option value="" disabled>
                      Selecione um efeito
                    </option>
                    {currentEffects.map((effect) => (
                      <option key={effect.name} value={effect.name}>
                        {statusLabels[effect.name] ?? effect.name}
                      </option>
                    ))}
                  </select>

                  {selectedEffect &&
                    (() => {
                      const effectData = currentEffects.find((e) => e.name === selectedEffect);
                      if (!effectData || effectData.values.length <= 1) return null;
                      return (
                        <select
                          className="p-1 border rounded text-sm mt-2"
                          value={effectValueIndex}
                          onChange={(e) => setEffectValueIndex(Number(e.target.value))}
                        >
                          {effectData.values.map((val, idx) => (
                            <option key={idx} value={idx}>
                              {val}
                              {effectData.valueType === "percent" ? "%" : ""}
                            </option>
                          ))}
                        </select>
                      );
                    })()}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </BaseModal>
  );
}
