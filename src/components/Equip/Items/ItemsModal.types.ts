export interface ItemProps {
  name: string;
  equipmentType: string
  readOnly?: boolean;
}

type PropValue = number | { min: number; max: number };
export type PropsData = Record<string, PropValue>;