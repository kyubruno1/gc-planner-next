import { ItemPropValue } from "../types/ItemProps";
import { formatStatValue } from "./statusLabels";

export function formatValue(value: ItemPropValue, key: string, rarity: string): string {
  if (value === undefined || value === null) return "-";
  if (typeof value === "number") return formatStatValue(key, value);
  if ("min" in value && "max" in value) {
    if (rarity === "ancient") {
      return `${formatStatValue(key, value.min)} ~ ${formatStatValue(key, value.max)}`;
    } else {
      return formatStatValue(key, value.max);
    }
  }
  return "-";
}
