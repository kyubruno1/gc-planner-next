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
            stone: true, // corrigido se for singular
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

    console.log("📦 Payload recebido:", JSON.stringify(body, null, 2));

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
          create: equipped.map((eq: any) => {
          console.log(eq)

            const stoneCreate = eq.stone && eq.stone.baseId && eq.stone.dataOverride
              ? {
                  create: {
                    baseId: eq.stone.baseId,
                    dataOverride: eq.stone.dataOverride,
                  },
                }
              : undefined;

            return {
              baseId: eq.baseId,
              propsOverride: eq.propsOverride || {},
              cards: {
                create: (eq.cards || []).map((card: any) => ({
                  baseId: card.baseId,
                  effectsOverride: card.effectsOverride,
                })),
              },
              stone: stoneCreate,
            };
          }),
        },
      },
    });

    return NextResponse.json({ success: true, buildId: build.id });
  } catch (error: any) {
    console.error("❌ Erro ao salvar build:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao salvar build", stack: error.stack },
      { status: 500 }
    );
  }
}

