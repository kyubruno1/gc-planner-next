import { CharacterStatus } from "../types/characterStatus";
import { StoneData } from "../types/stones";

export function stoneDataToStatus(data: StoneData): Partial<CharacterStatus> {
  const status: Partial<CharacterStatus> = {};

  const statusKey = data.statusType as keyof CharacterStatus | undefined;

  if (statusKey) {
    status[statusKey] = (status[statusKey] ?? 0) + data.value;
  }

  if (data.effect) {
    status[data.effect as keyof CharacterStatus] =
      (status[data.effect as keyof CharacterStatus] ?? 0) + (data.effectValue ?? 0);
  }

  if (data.automaticEffects && data.automaticEffects.length > 0) {
    for (const effect of data.automaticEffects) {
      const key = effect.name as keyof CharacterStatus;
      const val = effect.values[0] ?? 0;
      status[key] = (status[key] ?? 0) + val;
    }
  }

  return status;
}
