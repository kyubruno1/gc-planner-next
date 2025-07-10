'use client';

import { useCharacter } from "@/context/CharacterContext";
import { useEquip } from "@/context/EquipContext"; // Import necessário
import { characterLabel } from "@/utils/characterLabel";
import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";

interface SavedCharactersModalProps {
  onClose: () => void;
}

export function SavedCharactersModal({ onClose }: SavedCharactersModalProps) {
  const {
    savedCharacters,
    fetchSavedCharacters,
    removeCharacterFromSaved,
    setSelectedCharacter,
    setSelectedJobKey,
    setSheetName,
    reloadCharacter,
  } = useCharacter();


  const { setFullEquip } = useEquip();  // UseEquip para atualizar equipamentos

  const [loadingId, setLoadingId] = useState<string | null>(null);

  function handleLoadCharacter(sc: any) {
    console.log(sc)
    setFullEquip(sc)
    setSelectedCharacter(sc.character);
    setSelectedJobKey(sc.jobKey);

    reloadCharacter();

    setTimeout(() => {
      setLoadingId(null);
      onClose();
    }, 500);
  }

  // setLoadingId(sc.id);
  // setSelectedCharacter(sc.character);
  // setSelectedJobKey(sc.jobKey);
  // setSheetName(sc.sheetName || "Minha Build");

  // if (sc.equipped) {
  //   setFullEquip(sc.equipped);
  // }

  // reloadCharacter();

  // setTimeout(() => {
  //   setLoadingId(null);
  //   onClose();
  // }, 500);
  // }

  async function handleDeleteCharacter(id: string) {
    setLoadingId(id);
    await removeCharacterFromSaved(id);
    setLoadingId(null);
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="saved-characters-title"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded p-4 w-full max-w-md max-h-[80vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="saved-characters-title"
          className="text-xl font-bold text-white mb-4"
        >
          Personagens Salvos
        </h2>

        {(savedCharacters ?? []).length === 0 ? (
          <p className="text-gray-400">Nenhum personagem salvo.</p>
        ) : (
          <ul>
            {savedCharacters.map((sc) => (
              <li
                key={sc.id}
                className="mb-2 border-b border-gray-600 pb-2 flex justify-between items-center"
              >
                <div>
                  <strong className="text-white">
                    {sc.sheetName || 'Minha Build'}
                  </strong>
                  <br />
                  <small className="text-gray-400 capitalize">
                    {sc.character.name} -{' '}
                    {characterLabel[`${sc.character.name}_${sc.jobKey}`] ?? sc.jobKey} -{' '}
                    {characterLabel[sc.jobKey] ?? sc.jobKey}
                  </small>
                  <br />
                  <small className="text-gray-400">
                    {new Date(sc.savedAt).toLocaleString()}
                  </small>
                </div>
                <div className="space-x-2">
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded disabled:opacity-50 flex items-center justify-center"
                    onClick={() => handleLoadCharacter(sc)}
                    type="button"
                    disabled={loadingId === sc.id}
                  >
                    {loadingId === sc.id ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      "Carregar"
                    )}
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded disabled:opacity-50 flex items-center justify-center"
                    onClick={() => handleDeleteCharacter(sc.id)}
                    type="button"
                    disabled={loadingId === sc.id}
                  >
                    {loadingId === sc.id ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      "Deletar"
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <button
          className="mt-4 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
          onClick={onClose}
          type="button"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
