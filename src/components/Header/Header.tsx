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
    { href: "/equip/titulos", label: "Títulos" },
    { href: "/equip/colecao", label: "Coleção" },
    { href: "/equip/resumo", label: "Resumo" },
  ];

  const commonLinkClasses =
    "inline-block text-center px-4 py-2 rounded-[10px] border-[3px] border-b-0 font-bold mb-[-10px] min-w-[80px]";
  const baseLink = `${commonLinkClasses} bg-bgpagelight border-primary shadow-[0_0_0_3px_#415870]`;
  const activeLink = `${commonLinkClasses} bg-bgtextdark border-[#415870] text-white shadow-[0_0_0_3px_#415870]`;

  return (
    <nav className=" flex mt-4">
      <ul className="flex flex-wrap gap-2 mb-[-5px] justify-center max-w-[1200px] mx-auto items-center">
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
