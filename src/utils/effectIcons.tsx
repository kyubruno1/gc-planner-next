import { ArrowClockwise, Bug, CaretCircleDoubleUp, Coins, Drop, Heart, Heartbeat, Shield, ShieldCheck, Star, Sword } from "phosphor-react";

export const effectIcons: Record<string, JSX.Element> = {
  defense: <Shield size={16} className="text-blue-400" />,
  attack: <Sword size={16} className="text-green-400" />,
  hp: <Heart size={16} className="text-red-400" />,
  hp_rec: <Heartbeat size={16} className="text-red-400" />,
  mp_rec: <Drop size={16} className="text-blue-500" />,
  sp_attack: <Sword size={16} className="text-green-400" />,
  sp_def: <ShieldCheck size={16} className="text-gray-500" />,
  gp: <Coins size={16} className="text-yellow-500" />,
  taint_resistance: <Bug size={16} className="text-green-950" />,
  crit_chance: <Star size={16} className="text-yellow-300" />,
  crit_damage: <Star size={16} className="text-gold" />,
  back_attack: <ArrowClockwise size={16} />,
  exp: <CaretCircleDoubleUp size={16} />,
  hell_spear: <Sword size={16} className="text-purple-500" />,
  hell_spear_chance: <Sword size={16} className="text-purple-500" />,
};
