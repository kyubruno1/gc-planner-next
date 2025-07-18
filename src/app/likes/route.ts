import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId, buildId } = await req.json();

  const existing = await prisma.like.findFirst({
    where: { userId, buildId },
  });

  if (existing) {
    // Descurtir
    await prisma.like.delete({ where: { id: existing.id } });
    return NextResponse.json({ liked: false });
  }

  // Curtir
  await prisma.like.create({ data: { userId, buildId } });
  return NextResponse.json({ liked: true });
}
