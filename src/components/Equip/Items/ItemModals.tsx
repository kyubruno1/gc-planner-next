// components/Items/ItemModals.tsx

"use client";

import { CardModal } from "@/components/Modals/Cards";
import { CharacterStatus } from "@/types/characterStatus";
import { EquippedItem } from "@/types/equip";
import { StoneData } from "@/types/stones";
import { PropsModal } from "../../Modals/Props/PropsModal";
import { StonesModalWrapper } from "../../Modals/Stones/StonesModalWrapper";
import { EquipmentModal } from "../EquipmentModal";
import { PropsData } from "./ItemsModal.types";

type ItemModalsProps = {
  readOnly?: boolean;
  equippedItem: EquippedItem; // ideal: tipar melhor
  name: string;
  slotType: string;
  equipmentType: string;
  itemModal: string | null;
  setItemModal: (value: string | null) => void;
  cardModal: string | null;
  setCardModal: (value: string | null) => void;
  propsModal: PropsData | null;
  setPropsModal: (value: PropsData | null) => void;
  stoneModal: boolean;
  setStoneModal: (value: boolean) => void;
  stoneValues: Record<string, StoneData | undefined>;
  equipItem: (item: any) => void;
  equipProps: (slot: string, selectedProps: Record<string, number>) => void;
  handleApplyStone: (slotName: string, data: StoneData) => void;
  addSource: (key: string, status: Partial<CharacterStatus>) => void;
};

export function ItemModals({ readOnly, equippedItem, name, slotType, equipmentType, itemModal, setItemModal, cardModal, setCardModal, propsModal, setPropsModal, stoneModal, setStoneModal, stoneValues, equipItem, equipProps, handleApplyStone, addSource }: ItemModalsProps) {
  if (readOnly) return null;

  return (
    <>
      {itemModal && (
        <EquipmentModal
          type={itemModal}
          equipmentType={equipmentType}
          slotType={slotType}
          onSelectItem={(item) => {
            equipItem(item);
            addSource(item.name, item);
            setItemModal(null);
          }}
          onClose={() => setItemModal(null)}
        />
      )}

      {cardModal && equippedItem && (
        <CardModal
          onClose={() => setCardModal(null)}
          rarity={equippedItem.grade || "rare"}
          slotName={equippedItem.type}
        />
      )}

      {propsModal && equippedItem && (
        <PropsModal
          propsData={equippedItem.props}
          rarity={equippedItem.grade}
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

      {stoneModal && equippedItem && (
        <StonesModalWrapper
          onClose={() => setStoneModal(false)}
          rarity={equippedItem.grade}
          isAncient={equippedItem.grade === "ancient"}
          slotName={name}
          initialValue={stoneValues[name]}
          onApply={handleApplyStone}
        />
      )}
    </>
  );
}
