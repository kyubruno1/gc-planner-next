"use client";

import { useEffect, useState } from "react";
import { useAtkTotal } from "../../context/AtkTotalContext";
import { useEquip } from "../../context/EquipContext";
import { StoneData } from "../../types/stones";
import { PropsData, ItemProps as SlotProps } from "./ItemsModal.types";

import { getEquipImagePath } from "@/utils/imageHelpers.tsx";
import { stoneDataToStatus } from "@/utils/stoneHelpers.tsx";

import { CharacterStatus } from "@/types/characterStatus.ts";
import Image from "next/image";
import { CardModal } from "../CardModal/CardModal";
import { EquipmentModal } from "../EquipmentModal/EquipmentModal";
import { HoverModal } from "../HoverModal/HoverModal";
import { PropsModal } from "../PropsModal/PropsModal.tsx";
import { StonesModalWrapper } from "../StonesModal/StonesModalWrapper.tsx";

export function Items({ name, equipmentType, readOnly = false }: SlotProps) {
  const { addSource, removeSource } = useAtkTotal();
  const { equipped, equipItem, unequipItem, equipProps, equipStone, unequipStone } = useEquip();
  const equippedItem = equipped[name];

  const [itemModal, setItemModal] = useState<string | null>(null);
  const [cardModal, setCardModal] = useState<string | null>(null);
  const [propsModal, setPropsModal] = useState<PropsData | null>(null);
  const [stoneModal, setStoneModal] = useState(false);

  const [stoneValues, setStoneValues] = useState<Record<string, StoneData | undefined>>({});

  const [hovering, setHovering] = useState(false);

  const rarityColors: Record<string, string> = {
    common: "bg-gray-300 text-gray-900",
    normal: "bg-gray-300 text-gray-900",
    epic: "bg-gold text-white",
    ancient: "bg-purple-700 text-white",
  };

  // Sincroniza pedras locais com equipamento global
  useEffect(() => {
    const newStoneValues: Record<string, StoneData | undefined> = {};
    Object.entries(equipped).forEach(([slot, item]) => {
      if (item.stone) newStoneValues[slot] = item.stone;
    });
    setStoneValues(newStoneValues);
  }, [equipped]);

  function handleApplyStone(slotName: string, data: StoneData) {
    setStoneValues((prev) => ({
      ...prev,
      [slotName]: data,
    }));

    const status = stoneDataToStatus(data);
    addSource("stone:" + slotName, status);
    equipStone(slotName, data);
    setStoneModal(false);
  }

  function handleRemoveStone(slotName: string) {
    setStoneValues((prev) => {
      const copy = { ...prev };
      delete copy[slotName];
      return copy;
    });
    unequipStone(slotName);
    removeSource("stone:" + slotName);
  }

  function handleUnequipItem(slotName: string) {
    unequipItem(slotName);
    handleRemoveStone(slotName);
    removeSource(`equip:${slotName}:props`);
    // Remove fontes de cards do slot
    equippedItem?.cards?.forEach((_, i) => {
      removeSource(`equip:${slotName}:card${i}`);
    });
    removeSource(`equip:${slotName}`);
  }

  return (
    <>
      <div
        className="relative inline-block"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <button
          type="button"
          className="border-none p-0 relative"
          onClick={() => !readOnly && setItemModal(name)} // ✅ CONDICIONADO
        >
          <Image
            src={equippedItem ? equippedItem.img : getEquipImagePath(`${name}.png`)}
            alt={equippedItem ? equippedItem.name : name}
            className="w-[110px] h-[110px] border-2 border-gray rounded-md bg-light-gray"
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

          {stoneValues[name] && (
            <div className={`absolute bottom-1 right-8 pointer-events-none z-10`}>
              <div
                className={`${rarityColors[stoneValues[name].grade || "normal"]} text-xs font-bold px-1.5 py-[1px] rounded shadow`}
              >
                +{stoneValues[name].displayValue}
              </div>
            </div>
          )}
        </button>

        {/* ✅ BOTÕES SOMENTE SE NÃO FOR READONLY */}
        {hovering && equippedItem && !readOnly && (
          <div className="absolute top-0 left-10 ml-2 flex flex-col gap-[1px] p-1 rounded-md z-10">
            {equippedItem.equipType === "armor_set" && (
              <>
                <button
                  onClick={() => setCardModal(name)}
                  className="flex px-1 py-[3px] border border-gray-700 rounded-md bg-teal-400 hover:bg-teal-600 text-xs text-outline-lg text-white"
                >
                  Encaixe
                </button>

                <button
                  onClick={() => setStoneModal(true)}
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
                onClick={() => setPropsModal(equippedItem.props as PropsData)}
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
              onClick={() => handleUnequipItem(name)}
              className="flex px-1 py-[3px] border border-gray-700 rounded-md bg-red-400 hover:bg-red-600 text-xs"
            >
              Remover
            </button>
          </div>
        )}

        {hovering && equippedItem && <HoverModal slot={name} />}
      </div>

      {/* ✅ MODAIS APENAS SE NÃO FOR READONLY */}
      {!readOnly && itemModal && (
        <EquipmentModal
          type={itemModal}
          equipmentType="armor_set"
          slotType={equipmentType}
          onSelectItem={(item) => {
            equipItem(item);
            addSource(item.name, item);
            setItemModal(null);
          }}
          onClose={() => setItemModal(null)}
        />
      )}

      {!readOnly && cardModal && equippedItem && (
        <CardModal
          onClose={() => setCardModal(null)}
          rarity={equippedItem.grade || "rare"}
          slotName={equippedItem.type}
        />
      )}

      {!readOnly && propsModal && equippedItem && (
        <PropsModal
          propsData={equippedItem.props}
          rarity={equippedItem.grade as "rare" | "epic" | "legendary" | "ancient"}
          initialSelectedProps={equippedItem.selectedProps ?? {}}
          onClose={(selectedProps) => {
            equipProps(name, selectedProps);
            const validProps = Object.fromEntries(
              Object.entries(selectedProps).filter(([key]) => key in equippedItem)
            );
            addSource(`equip:${name}:props`, validProps as Partial<CharacterStatus>);
            setPropsModal(null);
          }}
        />
      )}

      {!readOnly && stoneModal && equippedItem && (
        <StonesModalWrapper
          onClose={() => setStoneModal(false)}
          rarity={equippedItem.grade as "normal" | "epic"}
          isAncient={equippedItem.grade === "ancient"}
          slotName={name}
          initialValue={stoneValues[name]}
          onApply={handleApplyStone}
        />
      )}
    </>
  );
}
