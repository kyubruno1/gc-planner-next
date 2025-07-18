import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: { buildId: string } }) {
  try {
    const buildId = params.buildId;
    const { userId, content } = await request.json();

    if (!userId || !content || content.trim() === "") {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const newComment = await prisma.comment.create({
      data: {
        buildId,
        userId,
        content,
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json(newComment);
  } catch (error) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
