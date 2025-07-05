// src/app/api/stones/route.ts
import { prisma } from "@/lib/prisma"; // Garanta que este arquivo exista
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const stones = await prisma.stoneBase.findMany();

    return NextResponse.json(stones);
  } catch (error) {
    console.error("[API /api/stones] Erro ao buscar pedras:", error);
    return new NextResponse("Erro ao buscar pedras", { status: 500 });
  }
}
