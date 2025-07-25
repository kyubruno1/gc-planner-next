import { useEquip } from "@/context/EquipContext";
import { itemNames } from "@/utils/ItemNames";
import { formatStatValue, statusLabels } from "@/utils/statusLabels";
import { useEffect, useState } from "react";

// interface BonusStats {
//   [statKey: string]: number;
// }

// interface Bonuses {
//   [piecesCount: string]: BonusStats;
// }

export interface SetDataItem {
  bonusType: string;
  name: string;
  setPieces: string[];
  [key: string]: string | string[] | Record<string, number>;
}

interface ActiveSet {
  name: string;
  bonusType: string;
  equippedPieces: string[];
  totalPieces: string[];
  pieceCount: number;
  bonuses: Record<string, Record<string, number>>;
}

interface BonusSetJson {
  id: string;
  bonusType: string;
  name: string;
  setPieces: string[];
  bonuses: Record<string, Record<string, number>>; // json armazenado no banco
}

export function SetEffectModal() {
  const { equipped } = useEquip();
  const [activeSets, setActiveSets] = useState<ActiveSet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSets() {
      setLoading(true);
      try {
        const res = await fetch("/api/bonus-sets");
        if (!res.ok) throw new Error("Falha ao buscar conjuntos");
        const data: BonusSetJson[] = await res.json();

        const active: ActiveSet[] = [];

        for (const set of data) {
          const equippedPieces = Object.values(equipped)
            .filter((item) => item.bonusType === set.bonusType)
            .map((item) => item.name);

          const pieceCount = equippedPieces.length;

          if (pieceCount > 0) {
            active.push({
              name: set.name,
              bonusType: set.bonusType,
              equippedPieces,
              totalPieces: set.setPieces,
              pieceCount,
              bonuses: set.bonuses,
            });
          }
        }

        setActiveSets(active);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchSets();
  }, [equipped]);

  return (
    <div className="absolute top-5 left-[31.5rem] ml-2 flex flex-col gap-[1px] p-1 rounded-md z-10 bg-bghovermodal/70 w-[32rem] text-white font-bold text-sm">
      {loading && <p className="p-4">Carregando conjuntos...</p>}
      {!loading && activeSets.length === 0 && (
        <p className="p-4 text-gray-400">Nenhum conjunto ativo.</p>
      )}

      {activeSets.map((set, idx) => {
        const thresholds = set.bonuses ? Object.keys(set.bonuses).map(Number) : [];
        const maxThreshold = thresholds.length ? Math.max(...thresholds) : 0;

        return (
          <div key={idx} className="border-b border-bgdarkblue">
            <div className="flex justify-center font-bold p-4 border-b border-bgdarkblue text-gold">
              {set.name}
            </div>

            <ul className="grid grid-cols-1 gap-2 mb-3 p-4 border-b border-bgdarkblue">
              {set.totalPieces.map((part, i) => {
                const isEquipped = set.equippedPieces.includes(part);
                const displayName = itemNames[part] || part.replace(/_/g, " ");
                return (
                  <li
                    key={i}
                    className={`p-1 ${isEquipped ? "text-gold" : "text-gray-400"}`}
                  >
                    {displayName}
                  </li>
                );
              })}
            </ul>

            <div className="p-4">
              <ul className="pl-2 space-y-1">
                {Array.from({ length: maxThreshold }, (_, i) => i + 1).map(
                  (threshold) => {
                    const stats = set.bonuses[threshold];
                    if (!stats) return null;

                    const isActive = set.pieceCount >= threshold;

                    return (
                      <li key={threshold} className="flex justify-between p-1">
                        <span className={isActive ? "text-gold" : "text-white"}>
                          Conjunto {threshold}:
                        </span>
                        <ul>
                          {Object.entries(stats).map(([statKey, statValue]) => (
                            <li
                              key={statKey}
                              className={isActive ? "text-gold" : "text-white"}
                            >
                              {statusLabels[statKey] || statKey}:{" "}
                              {formatStatValue(statKey, statValue)}
                            </li>
                          ))}
                        </ul>
                      </li>
                    );
                  }
                )}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}
