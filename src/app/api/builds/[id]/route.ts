import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "ID não fornecido." }, { status: 400 });
  }

  try {
    await prisma.build.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar build:", error);
    return NextResponse.json({ error: "Erro ao deletar build." }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  console.log("API PUT /api/builds/[id] chamada");

  const { id } = await context.params; // ✅ Awaiting params properly

  console.log(id);

  if (!id) {
    return NextResponse.json({ error: "ID não fornecido." }, { status: 400 });
  }

  try {
    const body = await req.json();
    console.log(body);

    const {
      characterId,
      jobKey,
      sheetName,
      totalAttack,
      status,
      equipped,
    } = body;

    await prisma.buildEquipment.deleteMany({
      where: { buildId: id },
    });

    const updatedBuild = await prisma.build.update({
      where: { id },
      data: {
        characterId,
        jobKey,
        sheetName,
        totalAttack,
        status: {
          upsert: {
            update: status,
            create: status,
          },
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

    return NextResponse.json({ success: true, buildId: updatedBuild.id });
  } catch (error) {
    console.error("Erro ao atualizar build:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar build" },
      { status: 500 }
    );
  }
}