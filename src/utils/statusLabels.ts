import { CharacterStatus } from "../types/characterStatus";

export const statusLabels: Record<string, string> = {
  total_attack: "Ataque Total",
  attack: "Ataque",
  crit_chance: "Chance de acerto crítico",
  crit_damage: "Dano Crítico",
  sp_attack: "Ataque Especial",
  mp_rec: "Recuperação de MP",
  hell_spear_chance: "Chance de Lança Infernal",
  hell_spear: "Lança Infernal",
  taint_resistance: "Resistência à Contaminação",
  defense: "Defesa",
  hp: "HP",
  crit_resistance: "Resistência a Crítico",
  sp_def: "Defesa Especial",
  hp_rec: "Recuperação de HP",
  counter_attack_resistance: "Resistência a Contra-ataque",
  exp: "EXP",
  gp: "GP",
  back_attack: "Dano pelas Costas",
  prop_level: "Nível da Prop",
  fortify_bonus: "Aumento de chance de sucesso de fortificação",
  protect_destruction: "Chance de proteção de destruição",
  mp_absorption: "Absorção de MP",
  hp_absorption: "Absorção de HP",
  mp_counter_attack: "Custo de MP do Contra-ataque",
  fatal_mp_rec: "Recuperação de MP no Fatal",
  fatal_super_armor: "Super Armadura no Fatal",
  grab_resistance: "Resistência a agarrão",
  potion_effect_rec: "Aumento de Efeito de Poção de Recuperação",
  fatal_potion_effect_rec: "Aumento de Efeito de Poção de Recuperação no Fatal",
  mov_speed: "Aumento de Velocidade de Movimento",
  fatal_mov_speed: "Aumento de Velocidade de Movimento no Fatal",
  pet_mp_rec: "Velocidade de Recuperação de MP da Mascote",
  fatal_attack_up: "Aumento de Ataque no Fatal"
};

export const orderedStatusKeys: (keyof typeof statusLabels)[] = [
  "attack",
  "defense",
  "hp",
  "crit_chance",
  "crit_damage",
  "hp_rec",
  "mp_rec",
  "gp",
  "sp_attack",
  "sp_def",
  "taint_resistance",
];

// Inverte o objeto: valores viram chaves e chaves viram valores
function invertLabels(labels: Record<string, string>): Record<string, string> {
  const inverted: Record<string, string> = {};
  for (const key in labels) {
    const val = labels[key];
    inverted[val] = key;
  }
  return inverted;
}

// Mapa invertido: nome legível => chave interna
const invertedStatusLabels = invertLabels(statusLabels);

// Função para mapear nome legível para chave
export function mapEffectNameToStatusKey(name: string): keyof CharacterStatus | null {
  return (invertedStatusLabels[name] as keyof CharacterStatus) ?? null;
}

// Conjunto de status que são percentuais
const percentStats = new Set([
  "crit_chance",
  "crit_damage",
  "mp_rec",
  "hell_spear_chance",
  "taint_resistance",
  "crit_resistance",
  "hp_rec",
  "counter_attack_resistance",
  "exp",
  "gp",
  "back_attack",
  "fortify_bonus",
  "protect_destruction",
  "mp_counter_attack"
]);

// Função para formatar valor (com % se necessário)
export function formatStatValue(key: string, value: number): string {
  if (percentStats.has(key)) {
    return `${value.toFixed(2)}%`;
  }
  return `${value}`;
}