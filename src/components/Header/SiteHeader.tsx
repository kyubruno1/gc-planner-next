"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const activeLink = "bg-gradient-to-t from-primary to-bgtextdark p-2 rounded-md text-yellow-300";

  const navLinks = isAuthenticated
    ? [
      { href: "/", label: "Início" },
      { href: "/equip", label: "Planner" },
      { href: "/minha-conta", label: "Minha Conta" },
      { href: "#", label: "Sair", onClick: () => signOut() },
    ]
    : [
      { href: "/", label: "Início" },
      { href: "/login", label: "Entrar" },
    ];

  return (
    <header className="w-full max-w-full overflow-x-auto flex items-center justify-between px-6 py-4 bg-bgtextdark">
      <Image
        src="/assets/images/logo_retangulo_header.svg"
        alt="Logo"
        width={100}
        height={60}
      />
      <nav>
        <ul className="flex gap-4 flex-wrap">
          {navLinks.map(({ href, label, onClick }) => {
            const isActive = pathname === href;

            return (
              <li key={label}>
                {onClick ? (
                  <button
                    onClick={onClick}
                    className={`text-xl text-white hover:text-gold ${isActive ? activeLink : ""}`}
                  >
                    {label}
                  </button>
                ) : (
                  <Link
                    href={href}
                    className={`text-xl text-white hover:text-gold ${isActive ? activeLink : ""}`}
                  >
                    {label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
