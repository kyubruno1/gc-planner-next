// app/equip/layout.tsx
"use client";

import { PlannerHeader } from "@/components/Header/HeaderPlanner/Header";
import { AtkTotalProvider } from "@/context/AtkTotalContext";
import { CharacterProvider } from "@/context/CharacterContext";
import { EquipProvider } from "@/context/EquipContext";

export default function EquipLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EquipProvider>
      <AtkTotalProvider>
        <CharacterProvider>
          <PlannerHeader />
          <main>{children}</main>
        </CharacterProvider>
      </AtkTotalProvider>
    </EquipProvider >
  );
}
