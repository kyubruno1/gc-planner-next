"use client";

import { BaseModal } from "@/components/UI/BaseModal/BaseModal";
import { ItemProps, ItemPropValue } from "@/types/ItemProps";
import { effectIcons } from "@/utils/effectIcons";
import { formatValue } from "@/utils/formatValue";
import { statusLabels } from "@/utils/statusLabels";
import { motion } from "framer-motion";
import { useState } from "react";

interface PropsModalProps {
  onClose: (selectedProps: Record<string, number>) => void;
  propsData: ItemProps;
  rarity: "rare" | "epic" | "legendary" | "ancient";
  initialSelectedProps?: Record<string, ItemPropValue>;
}

const maxSelectionByRarity = {
  rare: 2,
  epic: 3,
  legendary: 4,
  ancient: 5,
};

export function PropsModal({
  onClose,
  propsData,
  rarity,
  initialSelectedProps = {},
}: PropsModalProps) {
  const maxSelectable = maxSelectionByRarity[rarity] ?? 2;
  const normalizedInitialSelectedProps: Record<string, number> = {};

  // Normalizar ao carregar para sempre ser Record<string, number>
  for (const [key, val] of Object.entries(initialSelectedProps)) {
    if (typeof val === "number") normalizedInitialSelectedProps[key] = val;
    else if (val && "min" in val) normalizedInitialSelectedProps[key] = rarity === "ancient" ? val.min : val.max;
  }
  const [selectedProps, setSelectedProps] = useState<Record<string, number>>(normalizedInitialSelectedProps);

  const [error, setError] = useState<string | null>(null);

  function toggleSelect(key: string, value: ItemPropValue) {
    const isSelected = key in selectedProps;

    if (isSelected) {
      const copy = { ...selectedProps };
      delete copy[key];
      setSelectedProps(copy);
      setError(null);
      return;
    }

    if (Object.keys(selectedProps).length >= maxSelectable) {
      setError(`Você só pode escolher até ${maxSelectable} propriedades.`);
      return;
    }

    const val: number = typeof value === "number" ? value : rarity === "ancient" ? value.min : value.max;

    setSelectedProps({ ...selectedProps, [key]: val });
    setError(null);
  }

  function handleInputChange(key: string, min: number, max: number, input: string) {
    const parsed = parseFloat(input);
    if (!isNaN(parsed)) {
      const clamped = Math.max(min, Math.min(max, parsed));
      setSelectedProps((prev) => ({ ...prev, [key]: clamped }));
    }
  }

  // Ordem fixa das propriedades
  const orderedKeys = [
    "attack",
    "defense",
    "hp",
    "crit_chance",
    "crit_damage",
    "hp_rec",
    "mp_rec",
    "gp",
    "sp_attack",
    "sp_def",
    "taint_resistance",
  ];

  return (
    <BaseModal
      onClose={() => onClose(selectedProps)}
      maxWidth="40rem"
      maxHeight="auto"
      title="Propriedades do Item"
      titleColor="text-purple-500"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        <ul className="text-white text-sm space-y-2 max-h-auto overflow-y-auto px-2">
          {Object.entries(propsData)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .filter(([_, value]) => value !== undefined)
            .sort(([keyA], [keyB]) => {
              const indexA = orderedKeys.indexOf(keyA);
              const indexB = orderedKeys.indexOf(keyB);

              if (indexA === -1 && indexB === -1) return 0;
              if (indexA === -1) return 1;
              if (indexB === -1) return -1;

              return indexA - indexB;
            })
            .map(([key, value]) => {
              const isSelected = key in selectedProps;

              return (
                <li
                  key={key}
                  className={`flex flex-col gap-1 p-2 rounded-md transition-all duration-150 ${isSelected ? "bg-purple-700 text-white" : "hover:bg-gray-700 cursor-pointer text-gray-300"
                    }`}
                  onClick={() => toggleSelect(key, value)}
                >
                  <div className="flex justify-between items-center font-semibold">
                    <span className="flex items-center gap-1">
                      {effectIcons[key] ?? null}
                      {statusLabels[key] ?? key}:
                    </span>
                    <span>{formatValue(value, key, rarity)}</span>
                  </div>

                  {isSelected &&
                    rarity === "ancient" &&
                    typeof value === "object" &&
                    value !== null &&
                    "min" in value &&
                    "max" in value &&
                    value.min !== value.max && (
                      <input
                        type="number"
                        min={value.min}
                        max={value.max}
                        step="0.01"
                        className="mt-1 w-full px-2 py-1 rounded bg-gray-800 border border-gray-600 text-white"
                        value={selectedProps[key]}
                        onChange={(e) => handleInputChange(key, value.min, value.max, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                </li>
              );
            })}
        </ul>

        {/* Barra de progresso */}
        <div className="relative w-full h-2 bg-gray-800 rounded my-4">
          <div
            className="absolute top-0 left-0 h-2 rounded bg-purple-600 transition-all"
            style={{ width: `${(Object.keys(selectedProps).length / maxSelectable) * 100}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-white px-2">
          <span className="text-sm text-gray-300">
            Selecionados: {Object.keys(selectedProps).length} / {maxSelectable}
          </span>
          <button
            className="bg-green-600 px-4 py-1.5 rounded-md hover:bg-green-700 text-sm font-bold"
            onClick={() => onClose(selectedProps)}
          >
            Confirmar
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mt-3 px-2">{error}</p>}
      </motion.div>
    </BaseModal>
  );
}
