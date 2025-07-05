export interface CharacterStatus {
  total_attack: number;
  attack: number;
  crit_chance: number;
  crit_damage: number;
  sp_attack: number;
  mp_rec: number;
  hell_spear_chance: number;
  hell_spear: number;
  taint_resistance: number;
  defense: number;
  hp: number;
  crit_resistance: number;
  sp_def: number;
  hp_rec: number;
  counter_attack_resistance: number;
  exp: number;
  gp: number;
}

export const emptyCharacterStatus: CharacterStatus = {
  total_attack: 0,
  attack: 0,
  crit_chance: 0,
  crit_damage: 0,
  sp_attack: 0,
  mp_rec: 0,
  hell_spear_chance: 0,
  hell_spear: 0,
  taint_resistance: 0,
  defense: 0,
  hp: 0,
  crit_resistance: 0,
  sp_def: 0,
  hp_rec: 0,
  counter_attack_resistance: 0,
  exp: 0,
  gp: 0,
};