import { PrismaClient } from './src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.$queryRaw`SELECT 1;`;
  console.log('✅ Conexão bem-sucedida!', result);
}

main()
  .catch((e) => {
    console.error('❌ Erro ao conectar com o banco:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
