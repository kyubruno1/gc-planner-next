import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Buscar todos os equipamentos base que tenham bonusType preenchido
    const equipmentBases = await prisma.equipmentBase.findMany({
      where: {
        bonusType: {
          not: null,
        },
      },
      select: {
        bonusType: true,
        total_attack: true,
        attack: true,
        crit_chance: true,
        crit_damage: true,
        sp_attack: true,
        mp_rec: true,
        hell_spear_chance: true,
        hell_spear: true,
        taint_resistance: true,
        defense: true,
        hp: true,
        crit_resistance: true,
        sp_def: true,
        hp_rec: true,
        counter_attack_resistance: true,
        exp: true,
        gp: true,
      },
    });

    // Agrupar os bônus por bonusType somando os valores
    const groupedBonuses: Record<string, Record<string, number>> = {};

    for (const eq of equipmentBases) {
      const bt = eq.bonusType!;
      if (!groupedBonuses[bt]) {
        groupedBonuses[bt] = {};
      }

      for (const key in eq) {
        if (key === "bonusType") continue;
        const val = eq[key as keyof typeof eq];
        if (typeof val === "number" && val !== null) {
          groupedBonuses[bt][key] = (groupedBonuses[bt][key] || 0) + val;
        }
      }
    }

    // Transformar para array, se preferir
    const result = Object.entries(groupedBonuses).map(([bonusType, stats]) => ({
      bonusType,
      ...stats,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao buscar bonus sets" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
