// src/components/Equip/EquipGrid/index.tsx
"use client";

import { Items } from "@/components/Equip/Items/Items";
import Image from "next/image";
import { Status } from "../Status/Status";

interface EquipmentSlot {
  name: string;
  equipmentType: string;
}

interface EquipGridProps {
  equipmentLeft: EquipmentSlot[];
  equipmentRight: EquipmentSlot[];
  characterImagePath: string;
  onOpenCharacterModal: () => void;
}

export function EquipGrid({ equipmentLeft, equipmentRight, characterImagePath, onOpenCharacterModal }: EquipGridProps) {
  return (
    <div className="gap-5 p-4 sm:p-5 sm:max-w-[1400px] mx-auto rounded-[10px] border-4 shadow-dark-blue bg-bgpagelight border-primary">
      <div
        className="grid grid-cols-[0.5fr_1fr] md:grid-cols-[8.125rem_2fr_16.25rem] grid-rows-[auto_1fr_auto] gap-4"
      >
        {/* Equipment Left  */}
        <div className="order-2  grid grid-cols-1 grid-rows-6 gap-2.5 justify-items-center md:justify-start md:order-none">
          {equipmentLeft.map((slot) => (
            <Items name={slot.name} key={slot.name} slotType={slot.equipmentType} equipmentType="equip" />
          ))}
        </div>

        {/* Character Image  */}
        <div className="order-1 relative flex justify-center items-center md:order-none md:flex hidden">
          <button
            className="absolute top-2 right-2 z-10 cursor-pointer"
            onClick={onOpenCharacterModal}
            aria-label="Change Character"
          >
            <Image
              src="/assets/images/system/change_character.png"
              className="w-20 h-20 rounded-md"
              alt="Change Character"
              width={320}
              height={320}
            />
          </button>
          <Image
            width={960}
            height={800}
            priority
            src={characterImagePath}
            alt="Personagem"
            className="object-contain"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/assets/images/characters/arts/elesis_first_job.png";
            }}
          />
        </div>

        {/* Equipment Right  */}
        <div className="order-3 grid grid-flow-col grid-rows-6 gap-2.5 justify-items-center md:justify-end md:order-none">
          {equipmentRight.map((slot) => (
            <Items name={slot.name} key={slot.name} slotType={slot.equipmentType} equipmentType="equip" />
          ))}
        </div>

        {/* Status */}
        <div className="order-4 col-span-3 md:col-span-3">
          <Status />
        </div>
      </div>
    </div>

  );
}
