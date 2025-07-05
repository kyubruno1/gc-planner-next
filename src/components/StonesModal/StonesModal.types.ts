import { Effect, StoneType } from "../../types/stones";

export interface StonesModalProps {
  onClose: () => void;
  rarity: "normal" | "epic" | "ancient";
  isAncient: boolean;
  slotName: string;
  initialValue?: {
    stone: StoneType;
    value: number;
    effect?: string;
    effectValueIndex?: number;
  };  
  onApply: (
    slotName: string,
    data: {
      stone: StoneType;
      displayValue: number;
      value: number;
      effect?: string;
      effectValueIndex?: number;
      effectValue?: number;
      effectValueType?: "flat" | "percent";
      automaticEffects?: Effect[];
      statusType: string;
    }
  ) => void;
}

export interface StoneSlotData {
  type: string;
  special_effects: {
    default?: Effect[];
    ancient?: Effect[];
    "18"?: Effect[];
  };
  [level: string]: any;
}

export interface StoneDataItem {
  stone: "normal" | "epic";
  data: {
    [slotName: string]: StoneSlotData;
  };
}