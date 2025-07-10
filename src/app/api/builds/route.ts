import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const builds = await prisma.build.findMany({
      include: {
        character: true,
        status: true,
        equipments: {
          include: {
            cards: true,
            stones: true,
          },
        },
      },
      orderBy: { savedAt: "desc" },
    });

    return NextResponse.json(builds);
  } catch (error) {
    console.error("Erro ao buscar builds:", error);
    return NextResponse.json(
      { error: "Erro ao buscar builds" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      characterId,
      jobKey,
      sheetName,
      totalAttack,
      status,
      equipped,
    } = body;

    const build = await prisma.build.create({
      data: {
        characterId,
        jobKey,
        sheetName,
        totalAttack,
        status: {
          create: status,
        },
        equipments: {
          create: equipped.map((eq: any) => ({
            baseId: eq.baseId,
            propsOverride: eq.propsOverride,
            cards: {
              create: (eq.cards || []).map((card: any) => ({
                baseId: card.baseId,
                effectsOverride: card.effectsOverride,
              })),
            },
            stones: {
              create: (eq.stones || []).map((stone: any) => ({
                baseId: stone.baseId,
                dataOverride: stone.dataOverride,
              })),
            },
          })),
        },
      },
    });


    console.log('ok?')
    return NextResponse.json({ success: true, buildId: build.id });
  } catch (error) {
    console.error("Erro ao salvar build:", error);
    return NextResponse.json(
      { error: "Erro ao salvar build" },
      { status: 500 }
    );
  }
}
