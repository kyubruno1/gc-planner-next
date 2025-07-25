import { BaseModal } from "@/components/ui/BaseModal";
import { useEquip } from "@/context/EquipContext";
import { Card } from "@/types/cards";
import { getCardSlotCount } from "@/utils/getCardSlotCount";
import { gradeColors, itemNames } from "@/utils/ItemNames";
import Image from "next/image";
import { Trash } from "phosphor-react";
import { useEffect, useState } from "react";
import { CardSelectModal } from "./CardSelectModal";


export interface CardModalProps {
  onClose: () => void;
  rarity: string;
  slotName: string;
}

export function CardModal({ onClose, rarity, slotName }: CardModalProps) {
  const { equipped, equipCards } = useEquip();
  const equippedItem = equipped[slotName];

  const [allCards, setAllCards] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<(Card | null)[]>([]);
  const [openSlotIndex, setOpenSlotIndex] = useState<number | null>(null);

  const totalSlots = getCardSlotCount(rarity);

  useEffect(() => {
    async function loadCards() {
      try {
        const res = await fetch(`/api/cards?type=${slotName}`);
        if (!res.ok) throw new Error("Erro ao buscar cartas");
        const data: Card[] = await res.json();
        setAllCards(data);

        const equippedCardNames = equipped[slotName]?.cards?.map(c => c.name) ?? [];
        const reconstructed = Array.from({ length: 4 }).map((_, index) => {
          const name = equippedCardNames[index];
          return data.find((card: Card) => card.name === name) || null;
        });
        setSelectedCards(reconstructed);
      } catch (error) {
        console.error("Erro ao carregar cartas:", error);
        setAllCards([]);
        setSelectedCards([]);
      }
    }
    loadCards();
  }, [slotName, equipped]);

  const handleCardSelect = (cardName: string) => {
    if (openSlotIndex === null) return;
    const selectedCard = allCards.find(c => c.name === cardName);
    if (!selectedCard) return;
    const updated = [...selectedCards];
    updated[openSlotIndex] = selectedCard;
    setSelectedCards(updated);
    setOpenSlotIndex(null);
  };

  const handleClose = () => {
    const filteredCards = selectedCards.slice(0, totalSlots).filter(Boolean) as Card[];
    equipCards(slotName, filteredCards);
    onClose();
  };

  const handleCardRemove = (index: number) => {
    const updated = [...selectedCards];
    updated[index] = null;
    setSelectedCards(updated);
  };

  return (
    <BaseModal onClose={handleClose} maxWidth="90rem" maxHeight="auto" title={`Encaixe`} titleColor="text-blue-400">
      {equippedItem && (
        <>
          <div className="flex flex-col justify-center items-center">
            <span className={`${gradeColors[equippedItem.grade]} font-bold text-xl text-outline-lg`}>
              {itemNames[equippedItem.name]}
            </span>
          </div>
          <div className="flex flex-col justify-center items-center gap-4 p-4">
            <div className="w-[14rem] h-[14rem] p-1 bg-yellow-300 rounded-lg  outline-[3px] outline-gold">
              <Image
                width={216}
                height={216}
                src={equippedItem.img}
                alt={equippedItem.name}
                className="w-full h-full rounded-md"
              />
            </div>
          </div>
          <div className="w-3 h-32 bg-gradient-to-b from-[#2bb3f0] to-transparent mx-auto -mt-4 -mb-16" />
        </>
      )}
      <div className="flex flex-wrap justify-center gap-4">
        {Array.from({ length: 4 }).map((_, i) => {
          const isActive = i < totalSlots;
          const card = selectedCards[i];

          return (
            <div
              role="button"
              tabIndex={0}
              key={i}
              onClick={isActive ? () => setOpenSlotIndex(i) : undefined}
              className={`
                w-[250px] h-[350px] rounded-md border flex flex-col items-center justify-center text-center font-semibold shadow-md transition-colors duration-200 text-2xl p-1
                ${isActive
                  ? "bg-gradient-to-b from-bluecustom to-bgtextdark border-bgdarkblue cursor-pointer hover:brightness-110 text-white"
                  : "bg-gray-600 opacity-40 cursor-not-allowed text-gray-300"
                }
              `}
            >
              {card ? (
                <>
                  <div className="relative w-full h-full">
                    <Image
                      src={card.img}
                      alt={`Carta ${card.name}`}
                      className="max-w-full max-h-full rounded-lg mb-2"
                      loading="lazy"
                      width={216}
                      height={216}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardRemove(i);
                      }}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
                      title="Remover Carta"
                    >
                      <Trash size={20} />
                    </button>
                  </div>
                  <span className="truncate w-full px-1">{card.name}</span>
                </>
              ) : (
                isActive ? "Selecionar" : "Bloqueado"
              )}
            </div>
          );
        })}
      </div>

      {openSlotIndex !== null && (
        <CardSelectModal
          onSelectCard={handleCardSelect}
          onClose={() => setOpenSlotIndex(null)}
          slot={slotName}
        />
      )}
    </BaseModal>
  );
}
