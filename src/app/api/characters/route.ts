import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const characters = await prisma.character.findMany({
      include: {
        jobs: true, 
      },
    });

    return NextResponse.json(characters);
  } catch (error) {
    console.error("Erro na API /characters:", error);
    return NextResponse.json({ error: "Erro ao buscar personagens" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
