import { formatStatValue, statusLabels } from "@/utils/statusLabels";
import { useEffect, useState } from "react";
import { useEquip } from "../../context/EquipContext";
import { getCardSlotCount } from "../../utils/getCardSlotCount";
import { gradeColors, itemGrades, itemNames, slotNames } from "../../utils/ItemNames";
import { SetEffectModal } from "../Modals/SetEffect";

interface HoverModalProps {
  slot: string;
}

export function HoverModal({ slot }: HoverModalProps) {
  const [altPressed, setAltPressed] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Alt") {
        e.preventDefault();
        window.focus();
        setAltPressed(true);
      }
    }
    function onKeyUp(e: KeyboardEvent) {
      if (e.key === "Alt") {
        e.preventDefault();
        setAltPressed(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  const { equipped } = useEquip();
  const equippedItem = equipped[slot];
  if (!equippedItem) return null;


  const gradeColor = gradeColors[equippedItem.grade];

  // Busca o efeito especial baseado na pedra equipada
  const getSpecialEffect = () => {
    const stone = equippedItem.stone;
    if (!stone || !stone.data || !stone.data[slot]) return null;

    const level = Number(stone.displayValue);
    const stoneSlotData = stone.data[slot];

    let effectsArray = stoneSlotData?.special_effects?.default;

    if (stone.stone === "ancient" && stoneSlotData?.special_effects?.ancient) {
      effectsArray = stoneSlotData.special_effects.ancient;
    } else if (level === 18 && stoneSlotData?.special_effects?.["18"]) {
      effectsArray = stoneSlotData.special_effects["18"];
    }

    return effectsArray?.[0] ?? null;
  };

  const specialEffect = getSpecialEffect();

  return (
    <>
      <div className="clip-top-left-diagonal absolute top-5 left-28 ml-2 flex flex-col gap-[1px] p-1 rounded-md z-10 bg-bghovermodal/70 h-auto w-96">
        <div className={`text-shadow-title font-bold flex justify-center py-3 border-b border-bgdarkblue ${gradeColor}`}>
          <p>{itemNames[equippedItem.name]}</p>
        </div>

        <div className="flex p-4 justify-between border-b border-bgdarkblue  items-center">
          <div className="text-white text-shadow-title font-bold flex gap-5 items-center rounded-md">
            <img className="w-[110px] h-[110px] rounded-md" src={equippedItem.img} alt={equippedItem.name} />
            <div>
              <p>{slotNames[slot]}</p>
              <p>LV {equippedItem.equipLvl}</p>
            </div>
          </div>
          <p className={`${gradeColor} font-bold capitalize`}>{itemGrades[equippedItem.grade]}</p>
        </div>

        <div className="p-4 flex justify-between border-b border-bgdarkblue text-shadow-title font-bold">
          <div className="text-textLightBlue font-bold">
            <p className="text-white">Ataque Total</p>
            <p>Ataque</p>
            <p>Defesa</p>
            <p>HP</p>
          </div>
          <div className="text-white font-bold">
            <p>-</p>
            <p>{formatStatValue("attack", equippedItem.attack ?? 0)}</p>
            <p>{formatStatValue("defense", equippedItem.defense ?? 0)}</p>
            <p>{formatStatValue("hp", equippedItem.hp ?? 0)}</p>
          </div>
        </div>

        {/* Nível da pedra de fortificação */}
        {equippedItem.equipType !== "accessories_set" && (
          <>
            <div className="p-4 font-bold border-b border-bgdarkblue text-shadow-title">
              {equippedItem.stone && (
                <p className="text-yellow-300 text-sm mt-1">
                  Pedra de fortificação:{" "}
                  <span className="text-white font-semibold">
                    {itemGrades[equippedItem.stone.stone]} +{equippedItem.stone.displayValue}
                  </span>
                </p>
              )}
            </div>

            <div className="border-b border-bgdarkblue p-4">
              <div className="bg-bgdarkblue bg-opacity-70 text-white">
                <div className="p-4 text-white">
                  <div className="flex gap-4 flex-wrap flex-col">
                    {equippedItem.cards?.map((card, idx) => (
                      <div key={idx} className="flex gap-2">
                        <div className="w-[20px] h-[20px] border bg-gray-800 text-white flex items-center justify-center">
                          <button className="w-[16px] h-[16px] border bg-primary" />
                        </div>
                        <div>
                          {card.effects.map((effect, i) => (
                            <p key={i} className="text-xs">
                              {statusLabels[effect.name] || effect.name}: + {formatStatValue(effect.name, effect.value)}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}

                    {Array.from({ length: getCardSlotCount(equippedItem.grade) - (equippedItem.cards?.length || 0) }).map((_, idx) => (
                      <div key={`empty-${idx}`} className="flex gap-2">
                        <button className="w-[20px] h-[20px] border bg-gray-800 text-white" />
                        <span className="text-xs text-gray-300">Encaixe Vazio</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="border-b border-bgdarkblue p-4">
          <div className="p-4 text-white">
            {equippedItem.selectedProps && Object.keys(equippedItem.selectedProps).length > 0 ? (
              <div className="flex flex-col gap-2">
                {Object.entries(equippedItem.selectedProps).map(([key, value]) => {
                  const displayValue =
                    typeof value === "number"
                      ? formatStatValue(key, value)
                      : `Min: ${formatStatValue(key, value.min)} / Max: ${formatStatValue(key, value.max)}`;

                  return (
                    <div key={key} className="flex gap-1">
                      <span className="text-textLightBlue font-bold">
                        Efeito: {statusLabels[key] || key} +
                      </span>
                      <span className="text-textLightBlue font-bold">{displayValue}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-400">Nenhuma propriedade selecionada.</p>
            )}

            {specialEffect && (
              <div className="mt-2">
                <p
                  className={`font-bold text-sm ${Number(equippedItem.stone?.displayValue) === 18
                    ? "text-equipAncient"
                    : "text-yellow-400"
                    }`}
                >
                  Propriedade de fortificação: {statusLabels[specialEffect.name] ?? specialEffect.name} +{" "}
                  {formatStatValue(specialEffect.name, specialEffect.value)}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4">
          <h4 className="text-white">
            <span className="text-xl font-bold">Alt</span> pressione para mostrar efeito de conjunto
          </h4>
        </div>
      </div>

      {altPressed && <SetEffectModal />}
    </>
  );
}
