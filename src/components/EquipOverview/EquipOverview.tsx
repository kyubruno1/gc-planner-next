"use client";

import { useEquip } from "@/context/EquipContext";
import { itemGrades } from "@/utils/ItemNames";
import { statusLabels } from "@/utils/statusLabels";

export function EquipOverview() {
  const { equipped } = useEquip();

  return (
    <div className="text-white p-4 space-y-4 col-span-3 overflow-auto max-h-[600px]">
      {Object.entries(equipped).map(([slot, item]) => (
        <div key={slot} className="border p-2 rounded bg-gray-900">
          <h3 className="text-lg font-bold">SLOT: {slot}</h3>
          <p>Equipped: {item.name}</p>

          {/* Cards */}
          <p>
            Cards:{" "}
            {item.cards && item.cards.length > 0 ? (
              item.cards.map((card, i) => (
                <span key={i}>
                  {card.name}
                  {i < item.cards.length - 1 ? ", " : ""}
                </span>
              ))
            ) : (
              "Nenhuma"
            )}
          </p>

          {/* Props selecionadas */}
          <div>
            <p>Props Selecionadas:</p>
            {item.selectedProps ? (
              <ul className="ml-4 list-disc">
                {Object.entries(item.selectedProps).map(([key, val]) => {
                  if (
                    typeof val === "object" &&
                    val !== null &&
                    "min" in val &&
                    "max" in val
                  ) {
                    return (
                      <li key={key}>
                        {key}: {val.min} - {val.max}
                      </li>
                    );
                  }

                  return (
                    <li key={key}>
                      {key}: {val}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="ml-4">Nenhuma</p>
            )}
          </div>

          {/* Pedra */}
          <p>
            Pedra:{" "}
            {item.stone ? (
              <>
                {itemGrades[item.stone.stone]} (+{item.stone.displayValue}) (
                +{item.stone.value} {statusLabels[item.stone.statusType]})
              </>
            ) : (
              "Nenhuma"
            )}
          </p>
        </div>
      ))}
    </div>
  );
}
