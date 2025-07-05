import { Card } from "./cards";
import { CharacterStatus } from "./characterStatus";
import { ItemProps } from "./ItemProps";
import { StoneData } from "./stones";

export interface EquippedItem extends CharacterStatus {
  stone?: StoneData;
  name: string;
  type: string;
  img: string;
  bonusType: string;
  equipType?: string;
  grade: string;
  equipLvl: number;
  props: ItemProps;
  selectedProps?: Partial<ItemProps>;
  cards?: Card[];
}

export interface EquippedItems {
  [slot: string]: EquippedItem;
}
