import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }   
) {
  try {
    const buildId = params.id;              
    const { userId, content } = await req.json();

    if (!userId || !content?.trim()) {
      return NextResponse.json(
        { error: "Dados inválidos" },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: { buildId, userId, content },
      include: { user: true },
    });

    return NextResponse.json(comment);
  } catch (err) {
    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500 }
    );
  }
}
