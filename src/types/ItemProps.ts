export type ItemPropValue = number | { min: number; max: number };

export interface ItemProps {
  prop_level?: number;
  attack?: ItemPropValue;
  defense?: ItemPropValue;
  hp?: ItemPropValue;
  hp_rec?: ItemPropValue;
  mp_rec?: ItemPropValue;
  lv_min?: ItemPropValue;
  gp?: ItemPropValue;
  sp_attack?: ItemPropValue;
  sp_def?: ItemPropValue;
  crit_chance?: ItemPropValue;
  crit_damage?: ItemPropValue;
  taint_resistance?: ItemPropValue;
  back_attack?: ItemPropValue;
  exp?: ItemPropValue;
  hell_spear_chance?: ItemPropValue;
  hell_spear?: ItemPropValue;
}
