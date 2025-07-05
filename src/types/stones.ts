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
  displayValue?: string;
  effect?: string;
  effectValueIndex?: number;
  effectValue?: number;
  automaticEffects?: Effect[];
  type?: keyof CharacterStatus;
  effectValueType?: "flat" | "percent";
}

