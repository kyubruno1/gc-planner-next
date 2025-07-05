// import { seedCards } from "./seedCards.ts";
// import { seedCharacters } from "./seedCharacters.ts";
import { seedEquipmentBase } from "./seedEquipment.ts";

async function main() {
  // await seedCards();
  // await seedCharacters();
  await seedEquipmentBase();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Se precisar desconectar Prisma
  });
