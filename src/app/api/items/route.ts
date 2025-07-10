import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const equipmentType = url.searchParams.get("equipmentType") || undefined;
    const type = url.searchParams.get("type") || undefined;

    const where: any = {};

    if (equipmentType) where.equipType = equipmentType; // <-- corrige aqui
    if (type) where.type = type;

    const items = await prisma.equipmentBase.findMany({ where });

    return NextResponse.json(items);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao buscar itens" }, { status: 500 });
  }
}


export async function POST(request: Request) {
  try {
    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "IDs inválidos" }, { status: 400 });
    }

    const items = await prisma.equipmentBase.findMany({
      where: {
        id: { in: ids },
      },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao buscar itens por ID" }, { status: 500 });
  }
}