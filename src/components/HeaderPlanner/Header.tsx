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

  const baseLink =
    "inline-block w-[5rem] text-center bg-bgpagelight px-[10px] py-[10px] rounded-[10px] border-[3px] border-primary border-b-0 shadow-[0px_0px_0px_3px_#415870] font-bold mb-[-10px]";
  const activeLink = "inline-block w-[5rem] text-center bg-bgtextdark px-[10px] py-[10px] rounded-[10px] border-[3px] border-[#415870] border-b-0 font-bold mb-[-10px] text-white shadow-[0px_0px_0px_3px_#415870]";

  return (
    <nav className="grid grid-cols-[1fr_1200px_1fr]">
      <div />
      <ul className="flex gap-2 mb-[-5px] mt-4">
        {navLinks.map(({ href, label }) => {
          const isActive = pathname === href;

          return (
            <li key={href}>
              <Link href={href} className={`${isActive ? activeLink : baseLink}`}>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div />
    </nav>
  );
}
