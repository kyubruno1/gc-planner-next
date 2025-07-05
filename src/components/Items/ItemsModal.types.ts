export interface ItemProps {
  name: string;
  equipmentType: string
}

type PropValue = number | { min: number; max: number };
export type PropsData = Record<string, PropValue>;