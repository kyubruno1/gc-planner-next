"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function PlannerHeader() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/equip", label: "Equip" },
    { href: "/equip/visual", label: "Visual" },
    { href: "/equip/pet", label: "Pet" },
    { href: "/equip/runas", label: "Runas" },
    { href: "/equip/titulos", label: "Titulos" },
    { href: "/equip/colecao", label: "Coleção" },
    { href: "/equip/resumo", label: "Resumo" },
  ];

  const commonLinkClasses = "inline-block text-center px-4 py-2 rounded-[10px] border-[3px] border-b-0 font-bold mb-[-10px] min-w-[80px]";
  const baseLink = `${commonLinkClasses} bg-bgpagelight border-primary shadow-[0_0_0_3px_#415870]`;
  const activeLink = `${commonLinkClasses} bg-bgtextdark border-[#415870] text-white shadow-[0_0_0_3px_#415870]`;

  return (
    <nav className="w-full">
      <ul className="flex flex-wrap gap-3 sm:gap-2 mb-[-5px] mt-4 justify-center max-w-[1200px] mx-auto">
        {navLinks.map(({ href, label }) => {
          const isActive = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className={isActive ? activeLink : baseLink}
                aria-current={isActive ? "page" : undefined}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
