import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const buildId = params.id;
    const { userId } = await request.json();

    if (!userId || !buildId) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    // Verifica se o usuário já curtiu a build
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_buildId: { userId, buildId },
      },
    });

    if (existingLike) {
      return NextResponse.json({ error: "Você já curtiu essa build" }, { status: 400 });
    }

    // Cria o like
    const like = await prisma.like.create({
      data: {
        userId,
        buildId,
      },
    });

    return NextResponse.json({ liked: true, like });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao registrar like" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const buildId = params.id;
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    if (!userId || !buildId) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    // Remove o like
    await prisma.like.delete({
      where: {
        userId_buildId: { userId, buildId },
      },
    });

    return NextResponse.json({ liked: false });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao remover like" }, { status: 500 });
  }
}
