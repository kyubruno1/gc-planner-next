"use client";

import { BaseModal } from "@/components/UI/BaseModal/BaseModal";
import { SkeletonGridLoader } from "@/components/UI/SkeletonGridLoader/SkeletonGridLoader";
import { gradeColors, itemNames, slotNames } from "@/utils/ItemNames";
import { formatStatValue, statusLabels } from "@/utils/statusLabels";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { EquipmentModalProps, Item } from "./EquipmentModal.types";


export function EquipmentModal({ type, equipmentType, slotType, onSelectItem, onClose }: EquipmentModalProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevelMap, setSelectedLevelMap] = useState<Record<string, number>>({});

  useEffect(() => {
    async function loadItems() {
      try {
        const params = new URLSearchParams();
        if (equipmentType) params.append("equipmentType", equipmentType);
        if (type) params.append("type", type);

        const res = await fetch(`/api/items?${params.toString()}`);
        if (!res.ok) throw new Error("Erro ao buscar equipamentos");

        const data: Item[] = await res.json();
        setItems(data);
        setLoading(false);  // <<< importante
      } catch (error) {
        console.error(`Erro ao carregar dados do tipo ${type}`, error);
        setItems([]);
        setLoading(false);  // <<< importante também no erro
      }
    }
    loadItems();
  }, [equipmentType, type]);


  function getItemWithLevelApplied(item: Item): Item {
    if ((item.type === "necklace" || item.type === "bracelet") && item.statusNeck) {
      const level = selectedLevelMap[item.name] || 0;
      const statusKey = item.statusNeck.type as keyof Item;
      const value = item.statusNeck[level] as number;

      return {
        ...item,
        [statusKey]: value ?? 0,
        selectedLevel: level,
      };
    }
    return item;
  }

  if (loading) {
    return (
      <SkeletonGridLoader
        onClose={onClose}
        title={slotNames[type] ?? type}
        items={items.length || 3}
        cols={3}
        titleColor="text-purple-500"
        className="bg-bgdarkblue"
      />
    );
  }


  return (
    <BaseModal onClose={onClose} maxWidth="62.5rem" title={slotNames[type] ?? type} titleColor="text-purple-500">
      <div className="bg-bgdarkblue">
        <div className="grid grid-cols-3 gap-2.5 shadow-bgdarkblue border-primary rounded-md p-8 border-[5px] ">
          {items.map((item) => {
            const level = selectedLevelMap[item.name] || 0;
            const itemWithLevel = getItemWithLevelApplied(item);

            return (
              <div
                key={item.name}
                className="flex flex-col items-center justify-center rounded-md cursor-pointer shadow-bgdarkblue border-bgdarkblue text-shadow-title font-bold p-4 bg-gradient-to-b from-bluecustom to-bgtextdark"
                onClick={() => {
                  const selectedItem = { ...itemWithLevel };

                  if (slotType !== "equip" && itemWithLevel.props) {
                    selectedItem.selectedProps = {};

                    Object.entries(itemWithLevel.props).forEach(([key, value]) => {
                      const typedKey = key as keyof typeof itemWithLevel.props;

                      const min = value.min ?? 0;
                      const max = value.max ?? 0;

                      if (min > 0 && min === max) {
                        selectedItem.selectedProps![typedKey] = min; // valor único
                      }
                    });
                  }

                  onSelectItem(selectedItem);
                }}
              >
                <div className="w-full p-1 rounded-md shadow-bgdarkblue">
                  <h4 className={`${gradeColors[item.grade] || "text-white"} pb-2.5 text-center`}>
                    {itemNames[item.name] ?? item.name}
                  </h4>
                </div>
                <div className="relative w-64 h-64 rounded-lg">
                  <Image
                    src={item.img}
                    alt={item.name}
                    className="rounded-lg"
                    width={256}
                    height={256}
                    style={{ objectFit: "cover" }}
                    priority={false}
                  />
                </div>

                {(item.type === "necklace" || item.type === "bracelet") && item.statusNeck && (
                  <div className="flex gap-1 mt-2 flex-wrap justify-center">
                    {Array.from({ length: 10 }).map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLevelMap((prev) => ({ ...prev, [item.name]: index }));
                        }}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${level === index ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300"
                          }`}
                      >
                        {index}
                      </button>
                    ))}
                  </div>
                )}

                {slotType === "equip" ? (
                  <>
                    <p className="text-lg text-primary mt-2 space-y-1">Status base</p>
                    <div className="text-sm text-white mt-2 space-y-1">
                      {Object.entries(itemWithLevel)
                        .filter(
                          ([key, value]) =>
                            typeof value === "number" &&
                            value > 0 &&
                            [
                              "attack",
                              "crit_chance",
                              "crit_damage",
                              "sp_attack",
                              "mp_rec",
                              "hell_spear_chance",
                              "hell_spear",
                              "taint_resistance",
                              "defense",
                              "hp",
                              "crit_resistance",
                              "sp_def",
                              "hp_rec",
                              "counter_attack_resistance",
                              "exp",
                              "gp",
                            ].includes(key)
                        )
                        .map(([key, value]) => (
                          <p key={key}>
                            {statusLabels[key]}: {formatStatValue(key, value)}
                          </p>
                        ))}
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-lg text-primary mt-2 space-y-1">Propriedades disponíveis</p>
                    <div className="text-sm text-white mt-2 space-y-1">
                      {item.props &&
                        Object.entries(item.props)
                          // eslint-disable-next-line @typescript-eslint/no-unused-vars
                          .filter(([_, val]) => val.min > 0 || val.max > 0)
                          .map(([key, val]) => (
                            <p key={key}>
                              {statusLabels[key]}: {val.min === val.max ? val.min : `${val.min} ~ ${val.max}`}
                            </p>
                          ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </BaseModal>
  );
}
