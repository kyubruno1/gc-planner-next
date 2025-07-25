// src/components/UI/EditableText/index.tsx

import { KeyboardEvent, useEffect, useState } from "react";

interface EditableTextProps {
  value: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
  className?: string;
}

export function EditableText({ value, onChange, placeholder, className }: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  function handleSave() {
    const trimmed = tempValue.trim();
    onChange(trimmed || placeholder || "");
    setIsEditing(false);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleSave();
    }
    if (e.key === "Escape") {
      setTempValue(value);
      setIsEditing(false);
    }
  }

  if (isEditing) {
    return (
      <input
        type="text"
        value={tempValue}
        onChange={e => setTempValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={onKeyDown}
        autoFocus
        placeholder={placeholder}
        className={`text-lg font-semibold text-black border border-gray-400 rounded px-2 py-1 bg-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary ${className || ""}`}
      />
    );
  }

  return (
    <span
      className={`group inline-flex items-center gap-2 text-lg font-semibold text-black cursor-text px-2 py-1 border border-gray-300 rounded bg-gray-300 shadow-sm ${className || ""}`}
      title="Clique para editar"
      onClick={() => setIsEditing(true)}
    >
      {value}
      <span className="text-gray-500 group-hover:text-yellow-600 select-none">🖉</span>
    </span>
  );
}
