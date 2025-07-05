import { useEffect, useState } from "react";
import { StonesModal } from "./StonesModal";
import { StoneDataItem } from "./StonesModal.types";

export function StonesModalWrapper(
  props: Omit<React.ComponentProps<typeof StonesModal>, "stoneData">
) {
  const [stoneData, setStoneData] = useState<StoneDataItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStoneData() {
      setLoading(true);
      const res = await fetch("/api/stones");
      if (!res.ok) {
        console.error("Erro ao buscar pedras:", await res.text());
        setLoading(false);
        return;
      }
      const data = await res.json();
      setStoneData(data as StoneDataItem[]);
      setLoading(false);
    }

    fetchStoneData();
  }, []);

  if (loading) {
    return <div>Carregando pedras...</div>;
  }

  return <StonesModal {...props} stoneData={stoneData} />;
}
