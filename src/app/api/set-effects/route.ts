import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Busca todos os conjuntos de bônus já armazenados em JSON
    const sets = await prisma.bonusSetJson.findMany();

    // Aqui, se quiser, pode formatar ou retornar direto
    // O campo `bonuses` já é um JSON com a estrutura desejada
    // Exemplo de estrutura de `bonuses`: { "2": {...}, "3": {...}, ... }

    // Formatar a resposta para remover campos desnecessários, se desejar
    const formatted = sets.map(set => ({
      bonusType: set.bonusType,
      name: set.name,
      setPieces: set.setPieces,
      ...set.bonuses,  // espalha os bônus agrupados por quantidade de peças
    }));

    console.log(formatted)

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Erro na API /bonus-sets:", error);
    return NextResponse.json({ error: "Erro ao buscar bônus" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
