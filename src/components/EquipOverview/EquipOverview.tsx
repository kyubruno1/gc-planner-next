"use client";

import { useEquip } from "@/context/EquipContext";
import { gradeColors, itemGrades, itemNames, slotNames } from "@/utils/ItemNames";
import { formatStatValue, statusLabels } from "@/utils/statusLabels";

export function EquipOverview() {
  const { equipped } = useEquip();

  return (
    <div className="text-white p-4 space-y-6 col-span-3">
      <h2 className="text-xl font-semibold">Bônus de Set Ativos:</h2>

      {Object.entries(equipped).map(([slot, item]) => {
        const slotLabel = slotNames[slot] || slot;
        const itemLabel = itemNames[item.name] || item.name;
        const itemColor = gradeColors[item.grade] || "text-white";

        return (
          <div
            key={slot}
            className="p-5 mx-auto rounded-[10px] border-4 shadow-dark-blue bg-bghovermodal border-primary space-y-2"
          >
            <div className={`text-xl font-bold mb-2 text-shadow-title ${itemColor}`}>
              {itemLabel}
            </div>

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
                  {Object.entries(item.selectedProps).map(([key, val]) => {
                    const label = statusLabels[key] || key;

                    if (
                      typeof val === "object" &&
                      val !== null &&
                      "min" in val &&
                      "max" in val
                    ) {
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
                    <span className={gradeColors[item.stone.stone]}>
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
        );
      })}
    </div>
  );
}
