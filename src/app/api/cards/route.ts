import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const equipType = url.searchParams.get("type"); // helmet, armor, etc.

    const where: any = {};

    if (equipType) {
      where.type = {
        has: equipType, // filtra cartas que possuem o tipo no array
      };
    }

    const cards = await prisma.cardBase.findMany({
      where,
    });

    return NextResponse.json(cards);
  } catch (error) {
    console.error("Erro ao buscar cartas:", error);
    return NextResponse.json({ error: "Erro ao buscar cartas" }, { status: 500 });
  }
}
