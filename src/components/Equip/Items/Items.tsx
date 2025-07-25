"use client";

import { useAtkTotal } from "@/context/AtkTotalContext";
import { useEquip } from "@/context/EquipContext";
import { StoneData } from "@/types/stones";
import { stoneDataToStatus } from "@/utils/stoneHelpers";
import { useEffect, useState } from "react";
import { PropsData, ItemProps as SlotProps } from "./ItemsModal.types";

import { HoverModal } from "../HoverModal";
import { ActionButtons } from "./ActionButtons";
import { EquipButton } from "./EquipButton";
import { ItemModals } from "./ItemModals";

export function Items({ name, slotType, equipmentType, readOnly = false }: SlotProps) {
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
    removeSource("stone:" + slotName);
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
    const item = equipped[slotName];
    unequipItem(slotName);
    handleRemoveStone(slotName);
    removeSource(`equip:${slotName}:props`);
    item?.cards?.forEach((_, i) => removeSource(`equip:${slotName}:card${i}`));
    removeSource(`equip:${slotName}`);
  }

  return (
    <>
      <div
        className="relative inline-block"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <EquipButton
          name={name}
          equippedItem={equippedItem}
          stoneValue={stoneValues[name]}
          rarityColors={rarityColors}
          onClick={() => !readOnly && setItemModal(name)}
        />

        {hovering && equippedItem && !readOnly && (
          <ActionButtons
            equippedItem={equippedItem}
            onCardClick={() => setCardModal(name)}
            onStoneClick={() => setStoneModal(true)}
            onPropsClick={() => setPropsModal(equippedItem.props as PropsData)}
            onRemoveClick={() => handleUnequipItem(name)}
          />
        )}

        {hovering && equippedItem && <HoverModal slot={name} />}
      </div>

      <ItemModals
        readOnly={readOnly}
        equippedItem={equippedItem}
        name={name}
        slotType={slotType}
        equipmentType={equipmentType}
        itemModal={itemModal}
        setItemModal={setItemModal}
        cardModal={cardModal}
        setCardModal={setCardModal}
        propsModal={propsModal}
        setPropsModal={setPropsModal}
        stoneModal={stoneModal}
        setStoneModal={setStoneModal}
        stoneValues={stoneValues}
        equipItem={equipItem}
        equipProps={equipProps}
        handleApplyStone={handleApplyStone}
        addSource={addSource}
      />
    </>
  );
}
