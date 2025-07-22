"use client";

import { BaseModal } from "@/components/UI/BaseModal/BaseModal";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCharacter } from "../../../context/CharacterContext";
import { Character } from "../../../types/character";

interface CharacterSelectModalProps {
  onClose: () => void;
}

export function CharacterSelectModal({ onClose }: CharacterSelectModalProps) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCharacterName, setSelectedCharacterName] = useState<string | null>(null);

  const { setSelectedCharacter, setSelectedJobKey } = useCharacter();

  useEffect(() => {
    async function fetchCharacters() {
      try {
        setLoading(true);
        const res = await fetch("/api/characters");
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        const data: Character[] = await res.json();
        setCharacters(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Erro desconhecido ao carregar personagens");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchCharacters();
  }, []);


  return (
    <BaseModal onClose={onClose} maxWidth="90rem" title="Selecione seu Personagem" titleColor="text-gold">
      <div className="p-4 max-h-[80vh] overflow-auto">
        {error && <p className="text-red-500 font-bold">{error}</p>}

        <div className="grid lg:grid-cols-12 gap-6 sm:grid-cols-3">
          {loading
            ? Array.from({ length: 24 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center animate-pulse">
                <div className="h-5 w-20 bg-gray-600 rounded mb-2" />
                <div className="w-24 h-24 bg-gray-700 rounded mb-4" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="w-12 h-12 bg-gray-700 rounded" />
                  <div className="w-12 h-12 bg-gray-700 rounded" />
                </div>
              </div>
            ))
            : characters.map((char) => (
              <div
                key={char.id}
                className="flex flex-col items-center cursor-pointer"
                onClick={() =>
                  setSelectedCharacterName((prev) => (prev === char.name ? null : char.name))
                }
              >
                <h2 className="text-lg text-white font-semibold capitalize text-outline-md">
                  {char.name}
                </h2>
                <Image
                  src={char.img}
                  alt={char.name}
                  className="object-contain mb-4"
                  width={96}
                  height={96}
                />
                {selectedCharacterName === char.name && (
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    {Array.from({ length: char.qtJobs }).map((_, index) => {
                      const jobIndex = index + 1;
                      const baseImg = `/assets/images/system/${jobIndex}jb.png`;
                      const hoverImg = `/assets/images/system/${jobIndex}jb-hover.png`;
                      const jobKeys = ["first_job", "second_job", "third_job", "forth_job"];

                      return (
                        <Image
                          key={`${char.id}-${jobIndex}`}
                          src={baseImg}
                          onMouseOver={(e) => (e.currentTarget.src = hoverImg)}
                          onMouseOut={(e) => (e.currentTarget.src = baseImg)}
                          className="cursor-pointer transition duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCharacter(char);
                            setSelectedJobKey(jobKeys[jobIndex - 1]);
                            onClose();
                          }}
                          alt={`job-${jobIndex}`}
                          title={`Job ${jobIndex}`}
                          width={48}
                          height={48}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </BaseModal>
  );
}
