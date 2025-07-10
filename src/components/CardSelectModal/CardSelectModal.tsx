import { formatStatValue, statusLabels } from "@/utils/statusLabels";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Card } from "../../types/cards";
import { BaseModal } from "../BaseModal/BaseModal";
import { CardSelectModalProps } from "./CardSelectModal.types";

export function CardSelectModal({ slot, onSelectCard, onClose }: CardSelectModalProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedEffects, setSelectedEffects] = useState<string[]>([]);

  useEffect(() => {
    async function loadCards() {
      try {
        const res = await fetch(`/api/cards?type=${slot}`);
        if (!res.ok) throw new Error("Erro ao buscar cartas");
        const data: Card[] = await res.json();
        setCards(data);
      } catch (error) {
        console.error("Erro ao carregar cartas", error);
        setCards([]);
      }
    }
    loadCards();
  }, [slot]);

  // Pega lista única de efeitos que existem nas cartas filtradas
  const allEffects = Array.from(
    new Set(cards.flatMap((card) => card.effects.map((e) => e.name)))
  ).sort();

  // Filtra as cartas pelos efeitos selecionados (se houver algum filtro ativo)
  const filteredCards = selectedEffects.length === 0
    ? cards
    : cards.filter((card) =>
      selectedEffects.some(effectName =>
        card.effects.some(e => e.name === effectName)
      )
    );

  // Função pra alternar efeito selecionado no filtro
  function toggleEffect(effectName: string) {
    setSelectedEffects(prev =>
      prev.includes(effectName)
        ? prev.filter(e => e !== effectName)
        : [...prev, effectName]
    );
  }

  return (
    <BaseModal onClose={onClose} maxWidth="90rem" title="Selecione uma Carta" titleColor="text-purple-500">
      <div className="bg-bgdarkblue max-h-[750px] overflow-y-auto hide-scrollbar p-4 border-[7px] border-primary outline-[3px] outline outline-bgdarkblue rounded-md">

        {/* Filtros de efeitos */}
        <div className="mb-4 bg-bgtextdark border-b-[7px] border-primary outline-[3px] outline outline-bgdarkblue rounded-md p-4">
          <p className="mb-2 text-white font-semibold">Filtre por efeito de carta:</p>
          <div className="flex flex-wrap gap-2">
            {allEffects.map((effect) => (
              <button
                key={effect}
                onClick={() => toggleEffect(effect)}
                className={`px-3 py-1 rounded-full text-sm font-semibold
                  ${selectedEffects.includes(effect)
                    ? "bg-purple-600 text-white"
                    : "bg-gray-600 text-gray-100 hover:bg-purple-700 hover:text-white"
                  }`}
              >
                {statusLabels[effect] ?? effect}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de cartas filtradas */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredCards.map((card) => (
            <div
              key={card.name}
              onClick={() => onSelectCard(card.name)}
              className="flex flex-col items-center justify-start rounded-md cursor-pointer shadow-bgdarkblue border-bgdarkblue text-shadow-title font-bold p-4 bg-gradient-to-b from-bluecustom to-bgtextdark hover:brightness-110 min-h-[320px]"
            >
              <div className="w-full p-1 rounded-md shadow-bgdarkblue h-16">
                <h4 className="text-center text-white pb-2.5">{card.name}</h4>
              </div>
              <Image
                src={card.img}
                alt={card.name}
                className="aspect-square rounded-lg"
                loading="lazy"
                width={216}
                height={216}
              />
              <p className="text-lg text-primary mt-2">Efeitos</p>
              <div className="text-sm text-white mt-2 space-y-1 text-center">
                {card.effects.map((effect, index) => (
                  <p key={index}>
                    {statusLabels[effect.name] ?? effect.name}:{" "}
                    {formatStatValue(effect.name, effect.value)}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </BaseModal>
  );
}
