import { formatStatValue, statusLabels } from '@/utils/statusLabels';
import { useAtkTotal } from '../../context/AtkTotalContext';
import { CharacterStatus } from '../../types/characterStatus'; // onde você definiu o tipo

const offensiveStats: (keyof CharacterStatus)[] = [
  "attack",
  "crit_chance",
  "crit_damage",
  "sp_attack",
  "mp_rec",
  "hell_spear_chance",
  "hell_spear",
  "taint_resistance",
];

const defensiveStats: (keyof CharacterStatus)[] = [
  "defense",
  "hp",
  "crit_resistance",
  "sp_def",
  "hp_rec",
  "counter_attack_resistance",
  "exp",
  "gp",
];

export function Status() {
  const { atkTotal, characterStatus } = useAtkTotal();

  if (!characterStatus) return null;

  return (
    <div className="col-span-3 grid grid-cols-2 gap-2.5 bg-bgdarkblue rounded-lg border-3 border-primary shadow-darkblue mt-5">
      <p className="bg-bgtextdark text-gold font-bold text-2xl text-shadow-title rounded-lg col-span-2 flex justify-center items-center gap-4 px-5 py-2.5">
        <span>Ataque Total</span>
        <span>{atkTotal.toFixed(0)}</span>
      </p>

      <dl className="bg-bgtextdark rounded-lg p-5 space-y-2 font-bold text-textlight">
        {offensiveStats.map((key) => (
          <div key={key} className="flex justify-between">
            <dt className="text-shadow-title">{statusLabels[key] || key}</dt>
            <dd className="text-shadow-title">{formatStatValue(key, characterStatus[key] ?? 0)}</dd>
          </div>
        ))}
      </dl>

      <dl className="bg-bgtextdark rounded-lg p-5 space-y-2 font-bold text-textlight">
        {defensiveStats.map((key) => (
          <div key={key} className="flex justify-between">
            <dt className="text-shadow-title">{statusLabels[key] || key}</dt>
            <dd className="text-shadow-title">{formatStatValue(key, characterStatus[key] ?? 0)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
