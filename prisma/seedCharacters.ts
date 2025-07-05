import { PrismaClient } from "@prisma/client";
import { readFile } from "fs/promises";

const prisma = new PrismaClient();

export async function seedCharacters() {
  // Lê o arquivo JSON
  const rawData = await readFile("./prisma/data/characters.json", "utf-8");
  const characters = JSON.parse(rawData);

  console.log("Personagens do JSON:", characters);

  for (const char of characters) {
    console.log(`Criando personagem: ${char.name}`);

    // Prepara os jobs para criar
    const jobsData = Object.values(char.jobs).map((job: any) => ({
      name: job.name || job[0]?.name || "Job", // fallback
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

  // Busca tudo do banco e imprime para confirmar
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

  console.log("Personagens no banco:", JSON.stringify(allChars, null, 2));
}
