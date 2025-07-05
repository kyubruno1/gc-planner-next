export interface StatRange {
  min: number
  max: number
}

export interface Status {
  hp: number
  mp: number
  mp_plus?: number
  attack: number
  defense: number
  crit_chance?: number
  crit_damage?: number
  sp_attack?: number
  sp_def?: number
  hp_rec?: number
  mp_rec?: number
  gp?: number
  taint_resistance?: number
  crit_resistance?: number
  counter_attack_resistance?: number
  exp?: number
  hell_spear_chance?: number
  hell_spear?: number
  back_attack?: number
  [key: string]: number | undefined
}

export interface ItemProps {
  [key: string]: StatRange
}

export interface Item {
  id: string;
  name: string;
  type: string;
  grade: string;
  equipLvl: number;
  equipType: string;
  bonusType?: string;
  img?: string;
  status: Record<string, number>;        // Ex: { attack: 100, defense: 200 }
  props?: Record<string, { min: number; max: number }>;
  statusType?: string;                   // Ex: "attack"
  statusPerLevel?: Record<string, number>;  // Ex: { "0": 20, "1": 40, ..., "9": 505 }
  createdAt: string;
  updatedAt: string;
}

export interface Character {
  id: string
  name: string
  jobKey: string
  status: Status
  createdAt: string
  updatedAt: string
}

export interface Build {
  id: string
  characterId: string
  name: string
  equippedItems: Record<string, string> // slot -> itemId
  status: Status
  createdAt: string
  updatedAt: string
}

