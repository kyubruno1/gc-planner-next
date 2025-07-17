'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    if (res.ok) {
      router.push("/login");
    } else {
      const data = await res.json();
      setError(data.error || "Erro ao registrar");
    }
  }

  return (
    <div className="relative max-w-screen max-h-screen overflow-hidden h-[calc(100vh-5.4rem)]">
      {/* Imagem de fundo com opacidade */}
      <div className="absolute inset-0 bg-[url('/assets/images/login.png')] bg-cover bg-center opacity-20 z-0" />

      {/* Conteúdo principal */}
      <div className="max-h-screen relative z-10 grid grid-cols-2 w-full h-full px-6 bg-gradient-to-b from-bgdarkblue/70 to-bgtextdark/70">
        <div className="flex w-full h-full justify-center flex-col">
          <h1 className="text-center text-8xl font-bold bg-gradient-to-b from-amber-900 via-amber-600 to-amber-900 bg-clip-text text-transparent text-shadow-login mb-4 w-[700px] leading-[1.4]">
            Criar Conta
          </h1>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-[140px_1fr_auto] gap-4 p-6 w-[700px] bg-[linear-gradient(to_right,_transparent_0%,_rgba(0,0,0,0.6)_20%,_rgba(0,0,0,0.6)_80%,_transparent_100%)]"
          >
            {/* Email */}
            <label
              htmlFor="email"
              className="text-right text-3xl font-bold bg-gradient-to-b from-amber-900 via-amber-600 to-amber-900 bg-clip-text text-transparent text-shadow-login"
            >
              E-mail
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="Email"
              className="bg-black/20 border-2 border-amber-400 p-2 rounded w-full text-white focus:outline-none text-lg "
            />
            <div />

            {/* Username */}
            <label
              htmlFor="username"
              className="text-right text-3xl font-bold bg-gradient-to-b from-amber-900 via-amber-600 to-amber-900 bg-clip-text text-transparent text-shadow-login"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              placeholder="Username"
              className="bg-black/20 border-2 border-amber-400 p-2 rounded w-full text-white focus:outline-none text-lg"
            />
            {/* Botão na 3ª coluna */}
            <button
              type="submit"
              className="text-white font-bold text-lg px-4 py-2 rounded bg-gradient-to-b from-blue-800 via-blue-500 to-blue-800 hover:bg-blue-200 hover:text-blue-900 w-30"
            >
              Registrar
            </button>

            {/* Senha */}
            <label
              htmlFor="password"
              className="text-right text-3xl font-bold bg-gradient-to-b from-amber-900 via-amber-500 to-amber-900 bg-clip-text text-transparent text-shadow-login"
            >
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="Senha"
              className="focus:outline-none text-lg bg-black/20 border-2 border-amber-400 font-bold p-2 rounded w-full text-white "
            />

            {/* Espaço para alinhamento */}
            <div /> {/* vazio para preencher a 3ª coluna na linha da senha */}

            {/* Mensagem de erro */}
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
            alt="Logo"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
}
