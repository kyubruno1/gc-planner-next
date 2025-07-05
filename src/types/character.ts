import { CharacterStatus } from "./characterStatus";
import { EquippedItem } from "./equip";

export interface FullCharacter {
  status: CharacterStatus;
  totalAttack: number;
  equipped: Record<string, EquippedItem | null>;
  combinedSetsEffect: Partial<CharacterStatus>;
}

export interface CharacterSelection {
  characterName: string;
  jobKey: string;
}

interface JobCollectionBonus {
  name: string;
  value: number;
}

export interface Character {
  name: string;
  img: string;
  qtJobs: number;
  jobs: {
    first_job?: JobCollectionBonus[];
    second_job?: JobCollectionBonus[];
    third_job?: JobCollectionBonus[];
    forth_job?: JobCollectionBonus[];
  };
}