'use client';

import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Email ou senha inválidos");
    } else if (res?.ok) {
      router.push("/equip");
    }
  }

  return (
    <div className="relative max-w-screen max-h-screen overflow-hidden h-[calc(100vh-5.4rem)]">
      {/* Imagem de fundo com opacidade */}
      <div className="absolute inset-0 bg-[url('/assets/images/login.png')] bg-cover bg-center opacity-20 z-0" />

      {/* Conteúdo por cima */}
      <div className="relative z-10 grid grid-cols-2 w-full h-full p-6 bg-gradient-to-b from-bgdarkblue/70 to-bgtextdark/70">
        <div className="flex w-full h-full justify-center flex-col">
          <h1 className="text-center text-8xl font-bold bg-gradient-to-b from-amber-900 via-amber-600 to-amber-900 bg-clip-text text-transparent text-shadow-login mb-4 w-[700px] leading-[1.4]">
            Login
          </h1>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-[120px_1fr_auto] gap-4 p-6 w-[700px] bg-[linear-gradient(to_right,_transparent_0%,_rgba(0,0,0,0.6)_20%,_rgba(0,0,0,0.6)_80%,_transparent_100%)]"
          >
            <label htmlFor="email" className="text-right text-3xl font-bold bg-gradient-to-b from-amber-900 via-amber-600 to-amber-900 bg-clip-text text-transparent text-shadow-login">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="Email"
              className="bg-black/20 border-2 border-amber-400 p-2 rounded w-full text-white focus:outline-none text-lg"
            />
            <button
              type="submit"
              className="text-white font-bold text-lg px-4 py-2 rounded bg-gradient-to-b from-blue-800 via-blue-500 to-blue-800 hover:bg-blue-200 hover:text-blue-900 w-30"
            >
              Entrar
            </button>

            <label htmlFor="password" className="text-right text-3xl font-bold bg-gradient-to-b from-amber-900 via-amber-500 to-amber-900 bg-clip-text text-transparent text-shadow-login">
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="Senha"
              className="focus:outline-none text-lg bg-black/20 border-2 border-amber-400 font-bold p-2 rounded w-full text-white"
            />
            <div />

            {error && (
              <div className="col-span-3 text-red-600 text-sm text-center">
                {error}
              </div>
            )}
          </form>
        </div>

        <div className="m-auto">
          <Image
            src="/assets/images/gcp_logo.svg"
            width={800}
            height={800}
            alt=""
          />
        </div>
      </div>
    </div>
  );

}
