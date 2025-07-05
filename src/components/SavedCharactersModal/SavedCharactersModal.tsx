import { characterLabel } from "@/utils/characterLabel";
import { SavedCharacter } from "../../hooks/useSavedCharacters";

interface SavedCharactersModalProps {
  onClose: () => void;
  savedCharacters: SavedCharacter[];
  onLoadCharacter: (character: SavedCharacter) => void;
  onDeleteCharacter: (id: string) => void;
}

export function SavedCharactersModal({ onClose, savedCharacters, onLoadCharacter, onDeleteCharacter }: SavedCharactersModalProps) {

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center p-4">
      <div className="bg-gray-800 rounded p-4 w-full max-w-md max-h-[80vh] overflow-auto">
        <h2 className="text-xl font-bold text-white mb-4">Personagens Salvos</h2>

        {savedCharacters.length === 0 && (
          <p className="text-gray-400">Nenhum personagem salvo.</p>
        )}

        <ul>
          {savedCharacters.map((sc) => (
            <li key={sc.id} className="mb-2 border-b border-gray-600 pb-2 flex justify-between items-center">
              <div>
                <strong className="text-white">{sc.sheetName || "Minha Build"}</strong><br />
                <small className="text-gray-400 capitalize">{sc.character.name} - {characterLabel[`${sc.character.name}_${sc.jobKey}`]} - {characterLabel[sc.jobKey]} </small><br />
                <small className="text-gray-400">{new Date(sc.savedAt).toLocaleString()}</small>
              </div>
              <div className="space-x-2">
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded"
                  onClick={() => onLoadCharacter(sc)}
                >
                  Carregar
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                  onClick={() => onDeleteCharacter(sc.id)}
                >
                  Deletar
                </button>
              </div>
            </li>
          ))}
        </ul>

        <button
          className="mt-4 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
