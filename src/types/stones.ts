import { StoneSlotData } from "@/components/Equip/StonesModal/StonesModal.types";
import { CharacterStatus } from "./characterStatus";

export type StoneType = "normal" | "epic";

export interface Effect {
  valueType: string;
  name: keyof CharacterStatus;
  values: number[];
}

export interface StoneData {
  statusType: string;
  stone: StoneType;
  value: number;
  displayValue?: string | number;
  effect?: string;
  effectValueIndex?: number;
  effectValue?: number;
  automaticEffects?: Effect[];
  type?: keyof CharacterStatus;
  effectValueType?: "flat" | "percent";

  data?: Record<string, StoneSlotData>;


  grade?: "common" | "normal" | "rare" | "epic" | "ancient";
}

