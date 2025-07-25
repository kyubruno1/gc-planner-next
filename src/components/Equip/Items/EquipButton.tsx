// components/Items/EquipButton.tsx

"use client";

import { StoneData } from "@/types/stones";
import { getEquipImagePath } from "@/utils/imageHelpers";
import Image from "next/image";

type Props = {
  name: string;
  equippedItem?: {
    img: string;
    name: string;
    selectedLevel?: number;
  };
  stoneValue?: StoneData;
  rarityColors: Record<string, string>;
  onClick: () => void;
};

export function EquipButton({ name, equippedItem, stoneValue, rarityColors, onClick }: Props) {
  return (
    <button
      type="button"
      className="border-none p-0 relative cursor-pointer"
      onClick={onClick}
    >
      <Image
        src={equippedItem ? equippedItem.img : getEquipImagePath(`${name}.png`)}
        alt={equippedItem ? equippedItem.name : name}
        className="w-[110px] h-[110px] sm:w-[110px] sm:h-[110px] max-sm:w-[85px] max-sm:h-[85px] border-2 border-gray rounded-md bg-light-gray"
        width={110}
        height={110}
      />

      {equippedItem?.selectedLevel !== undefined && (
        <div className="absolute bottom-1 right-1 pointer-events-none z-10">
          <div className="bg-blue-500 text-white text-xs font-bold px-1.5 py-[1px] rounded shadow">
            +{equippedItem.selectedLevel}
          </div>
        </div>
      )}

      {stoneValue && (
        <div className="absolute bottom-1 right-8 pointer-events-none z-10">
          <div
            className={`${rarityColors[stoneValue.grade || "normal"]} text-xs font-bold px-1.5 py-[1px] rounded shadow`}
          >
            +{stoneValue.displayValue}
          </div>
        </div>
      )}
    </button>
  );
}
