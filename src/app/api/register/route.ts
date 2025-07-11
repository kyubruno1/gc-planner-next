import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 1. Lê o corpo da requisição (esperamos JSON com email e senha)
    const { email, password } = await req.json();

    // 2. Validação simples: verifica se os dados foram enviados
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha obrigatórios" },
        { status: 400 }
      );
    }

    // 3. Verifica se já existe usuário com esse email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Usuário já existe" },
        { status: 409 }
      );
    }

    // 4. Cria o hash da senha (nunca salva senha em texto puro!)
    const hashedPassword = await hash(password, 10);

    // 5. Cria o usuário no banco
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    // 6. Retorna sucesso
    return NextResponse.json({
      message: "Usuário criado com sucesso",
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    // 7. Em caso de erro, retorna erro genérico
    return NextResponse.json(
      { error: "Erro interno ao registrar usuário" },
      { status: 500 }
    );
  }
}
