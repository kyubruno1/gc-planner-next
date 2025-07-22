import { CharacterStatus } from "../../../types/characterStatus";
import { EquippedItem } from "../../../types/equip";

interface StatusNeck {
  type: keyof CharacterStatus; 
  [level: number]: number | string; 
}

export interface Item extends EquippedItem {
  name: string;
  img: string;
  grade: string;
  statusNeck?: StatusNeck;
  selectedLevel?: number;
}

export interface EquipmentModalProps {
  type: string;
  equipmentType: string,
  slotType: string,
  onSelectItem: (item: Item) => void;
  onClose: () => void;
}