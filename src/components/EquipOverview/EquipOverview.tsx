"use client";

import { useEquip } from "@/context/EquipContext";
import { ItemProps } from "@/types/ItemProps";
import { gradeColors, itemGrades, itemNames, setEffectNames } from "@/utils/ItemNames";
import { formatStatValue, orderedStatusKeys, statusLabels } from "@/utils/statusLabels";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export function EquipOverview() {
  const { equipped, calculateBonusExtras } = useEquip();
  const bonusExtras = calculateBonusExtras();

  const [openSlots, setOpenSlots] = useState<Record<string, boolean>>({});

  const toggleSlot = (slot: string) => {
    setOpenSlots((prev) => ({ ...prev, [slot]: !prev[slot] }));
  };

  return (
    <div className="text-white p-4 space-y-6 col-span-3">

      {/* Bônus de Set Ativos */}
      <div className=" rounded-xl text-bgtextdark">
        <h2 className="text-xl font-semibold">Bônus de Set Ativos:</h2>
        {Object.keys(bonusExtras).length > 0 ? (
          <ul className="list-disc pl-6 space-y-1">
            {Object.entries(bonusExtras).map(([key, stats]) => (
              <li key={key}>
                <strong>{setEffectNames[key]}:</strong>
                <ul className="list-circle pl-4">
                  {Object.entries(stats).map(([statKey, statValue]) => (
                    <li key={statKey}>
                      {statusLabels[statKey] || statKey}: {formatStatValue(statKey, statValue)}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">Nenhum bônus de set ativo.</p>
        )}
      </div>

      {/* Equipamentos Equipados */}
      <h2 className="text-xl text-bgtextdark font-semibold border-t pt-4">Equipamentos:</h2>
      {Object.entries(equipped).map(([slot, item]) => {
        const itemLabel = itemNames[item.name] || item.name;
        const itemColor = gradeColors[item.grade] || "text-white";
        const isOpen = openSlots[slot] ?? true;

        return (
          <>
            <div
              key={slot}
              className="p-4 rounded-[10px] border-4 shadow-dark-blue bg-bghovermodal border-primary"
            >
              <button
                className="w-full flex justify-between items-center text-left"
                onClick={() => toggleSlot(slot)}
              >
                <div className={`text-xl font-bold text-shadow-title ${itemColor}`}>
                  {itemLabel}
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>

              {isOpen && (
                <div className="mt-4 space-y-3">

                  {/* Cartas */}
                  <div>
                    <p className="text-gray-200 font-semibold">Cartas:</p>
                    <div className="ml-4 text-white">
                      {item.cards && item.cards.length > 0 ? (
                        item.cards.map((card) => card.name).join(" - ")
                      ) : (
                        <span className="text-gray-400">Nenhuma</span>
                      )}
                    </div>
                  </div>

                  {/* Props */}
                  <div>
                    <p className="text-gray-200 font-semibold">Propriedades Selecionadas:</p>
                    {item.selectedProps ? (
                      <ul className="ml-4 list-disc">
                        {orderedStatusKeys.map((key) => {
                          const val = item.selectedProps?.[key as keyof ItemProps];
                          if (val === undefined) return null;

                          const label = statusLabels[key] || key;

                          if (typeof val === "object" && val !== null && "min" in val && "max" in val) {
                            const displayValue =
                              val.min === val.max
                                ? formatStatValue(key, val.min)
                                : `${formatStatValue(key, val.min)} ~ ${formatStatValue(key, val.max)}`;

                            return <li key={key}>{label}: {displayValue}</li>;
                          }

                          return (
                            <li key={key}>
                              {label}: {formatStatValue(key, val)}
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <div className="ml-4 text-gray-400">Nenhuma</div>
                    )}
                  </div>

                  {/* Pedra */}
                  <div>
                    <p className="text-gray-200 font-semibold">Pedra:</p>
                    <div className="ml-4">
                      {item.stone ? (
                        <>
                          <span className={`${gradeColors[item.stone.stone]} capitalize`}>
                            {itemGrades[item.stone.stone]}
                          </span>{" "}
                          +{item.stone.displayValue} (
                          +{formatStatValue(item.stone.statusType, item.stone.value)}{" "}
                          {statusLabels[item.stone.statusType] || item.stone.statusType})
                        </>
                      ) : (
                        <span className="text-gray-400">Nenhuma</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        );
      })}
    </div>
  );
}
