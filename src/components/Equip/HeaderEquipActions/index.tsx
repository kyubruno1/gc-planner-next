// src/components/Equip/EquipHeaderActions/index.tsx
"use client";

import { EditableText } from "@/components/UI/EditableText";
import { PresetButtonsEquip } from "../PresetButtonsEquip/PresetButtonsEquip";

interface EquipHeaderActionsProps {
  sheetName: string;
  setSheetName: (name: string) => void;
  onSave: () => void;
  onOpenSaved: () => void;
}

export function EquipHeaderActions({ sheetName, setSheetName, onSave, onOpenSaved }: EquipHeaderActionsProps) {
  const baseClasses = "p-5 max-w-[1200px] mx-auto rounded-[10px] border-4 shadow-dark-blue flex flex-col gap-5 w-full bg-bgpagelight border-primary";

  return (
    <div className={`${baseClasses}`}>
      <label htmlFor="sheetNameInput" className="text-sm text-gray-600">
        Dê um título para a build:
      </label>

      <EditableText value={sheetName} onChange={setSheetName} placeholder="Minha Build" />

      <div className="flex flex-col gap-2">
        <button
          onClick={onSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded z-50"
          type="button"
        >
          Salvar Build
        </button>
        <button
          onClick={onOpenSaved}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded z-50"
          type="button"
        >
          Abrir Builds Salvas
        </button>
      </div>

      <PresetButtonsEquip />
    </div>
  );
}
