"use client";

import { SkeletonGridLoader } from "@/components/ui/SkeletonGridLoader";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { StoneDataItem, StonesModal, StonesModalProps } from "./StonesModal";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface WrapperProps extends Omit<StonesModalProps, "stoneData"> { }

export function StonesModalWrapper(props: WrapperProps) {
  const [stoneData, setStoneData] = useState<StoneDataItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStoneData() {
      try {
        const res = await fetch("/api/stones");
        if (!res.ok) throw new Error("Erro na resposta da API");

        const data = await res.json();
        setStoneData(data);
      } catch (err) {
        console.error("Erro ao buscar dados das pedras:", err);
        toast.error("Erro ao carregar dados das pedras de fortificação.");
      } finally {
        setLoading(false);
      }
    }

    fetchStoneData();
  }, []);

  if (loading || !stoneData) {
    return (
      <SkeletonGridLoader
        onClose={props.onClose}
        title="Pedras de Fortificação"
        items={stoneData?.length ?? 2}
        cols={2}
        titleColor="text-purple-500"
        className="bg-bgdarkblue"
      />
    );
  }



  return <StonesModal {...props} stoneData={stoneData} />;
}
