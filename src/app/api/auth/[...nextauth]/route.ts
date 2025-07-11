import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcrypt";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// 🔐 Configurações principais do NextAuth
export const authOptions: AuthOptions  = {
  // Prisma + NextAuth integrados
  adapter: PrismaAdapter(prisma),

  // 🧾 Usa JWT para armazenar sessão
  session: {
    strategy: "jwt",
  },

  // 🧍 Provedores de login (nesse caso, email/senha)
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      // 🧠 Função que valida o login
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Busca o usuário no banco
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // Se não achou, ou não tem senha salva, falha
        if (!user || !user.password) return null;

        // Compara senha digitada com a hash do banco
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) return null;

        return user;
      },
    }),
  ],
  //  Redirecionamento customizado
  pages: {
    signIn: "/login", // página de login customizada
  },
  //  Callbacks: manipular dados de sessão e token JWT
  callbacks: {
    // Manipula o que é salvo na sessão
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!; // injeta o id do usuário na session
      }
      return session;
    },

    // Manipula o token JWT antes de salvar
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token; // adiciona id do usuário ao token
    },
  },
};

// Exporta o handler como GET e POST
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
