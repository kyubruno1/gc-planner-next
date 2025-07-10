import { PrismaClient } from "@prisma/client";
import { readFile } from "fs/promises";

const prisma = new PrismaClient();

export async function seedCharacters() {
  const rawData = await readFile("./prisma/data/characters.json", "utf-8");
  const characters = JSON.parse(rawData);

  // console.log("Personagens do JSON:", characters);

  for (const char of characters) {
    const existing = await prisma.character.findUnique({
      where: { name: char.name },
    });

    if (existing) {
      console.log(`Personagem "${char.name}" já existe. Pulando...`);
      continue;
    }

    console.log(`Criando personagem: ${char.name}`);

    const jobsData = Object.values(char.jobs).map((job: any) => ({
      name: job.name || job[0]?.name || "Job",
      statuses: {
        create: job.map((status: any) => ({
          name: status.name,
          value: status.value,
        })),
      },
    }));

    await prisma.character.create({
      data: {
        name: char.name,
        img: char.img,
        qtJobs: char.qtJobs,
        jobs: {
          create: jobsData,
        },
      },
    });
  }

  const allChars = await prisma.character.findMany({
    include: {
      jobs: {
        include: {
          statuses: true,
        },
      },
      builds: true,
    },
  });

  // console.log("Personagens no banco:", allChars);
}
