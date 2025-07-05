import { prisma } from '@/lib/prisma';

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();

  const {
    characterId,
    jobKey,
    sheetName,
    equipped,
    totalAttack,
    status,
    combinedSetsEffect,
  } = body;

  const newBuild = await prisma.build.create({
    data: {
      characterId,
      jobKey,
      sheetName,
      totalAttack,
      status: {
        create: status,
      },
      // Isso exige que você crie também os Equipamentos, Cartas, etc.
    },
  });

  return NextResponse.json(newBuild);
}
