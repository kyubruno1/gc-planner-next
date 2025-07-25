// components/Items/ActionButtons.tsx

"use client";

import Image from "next/image";

type Props = {
  equippedItem: {
    equipType: string;
    type: string;
  };
  onCardClick: () => void;
  onStoneClick: () => void;
  onPropsClick: () => void;
  onRemoveClick: () => void;
};

export function ActionButtons({ equippedItem, onCardClick, onStoneClick, onPropsClick, onRemoveClick }: Props) {
  return (
    <div className="absolute top-0 left-10 ml-2 flex flex-col gap-[2px] p-1 rounded-md z-10 max-sm:gap-0 max-sm:left-1">
      {equippedItem.equipType === "armor_set" && (
        <>
          <button
            onClick={onCardClick}
            className="flex px-1 py-[3px] border border-gray-700 rounded-md bg-teal-400 hover:bg-teal-600 text-xs text-white"
          >
            Encaixe
          </button>

          <button
            onClick={onStoneClick}
            className="flex px-1 py-[3px] border border-gray-700 rounded-md bg-blue-500 hover:bg-blue-400 text-xs"
          >
            <Image
              src="/assets/images/system/clean-stone.png"
              width={32}
              height={11}
              className="mx-auto"
              alt="Gerenciar Pedra"
            />
          </button>
        </>
      )}

      {equippedItem.type !== "bracelet" && equippedItem.type !== "necklace" && (
        <button
          onClick={onPropsClick}
          className="flex px-1 py-[3px] border border-gray-700 rounded-md bg-purple-500 hover:bg-purple-400 text-xs"
        >
          <Image
            src="/assets/images/system/arrow_cropped.png"
            width={32}
            height={11}
            className="mx-auto"
            alt="Propriedades"
          />
        </button>
      )}

      <button
        onClick={onRemoveClick}
        className="flex px-1 py-[3px] border border-gray-700 rounded-md bg-red-400 hover:bg-red-600 text-xs"
      >
        Remover
      </button>
    </div>
  );
}
