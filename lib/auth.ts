// lib/auth.ts

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Extender tipos do NextAuth
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        console.log("🔐 Tentando login:", credentials?.email);

        // Credenciais fixas para teste
        if (credentials?.email === "admin@easyprospect.com" && credentials?.password === "senha123") {
          console.log("✅ Login autorizado");
          return {
            id: "1",
            email: credentials.email,
            name: "Administrador"
          };
        }

        // Credencial de teste
        if (credentials?.email === "teste@teste.com" && credentials?.password === "senha123") {
          console.log("✅ Login autorizado (teste)");
          return {
            id: "2",
            email: credentials.email,
            name: "Usuário Teste"
          };
        }

        console.log("❌ Credenciais inválidas");
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email || "";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};