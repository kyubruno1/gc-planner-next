import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "IDs inválidos" }, { status: 400 });
    }

    const cards = await prisma.cardBase.findMany({
      where: {
        id: { in: ids },
      },
    });

    return NextResponse.json(cards);
  } catch (error) {
    console.error("[CARDS BY ID] Erro ao buscar cartas:", error);
    return NextResponse.json({ error: "Erro ao buscar cartas" }, { status: 500 });
  }
}
