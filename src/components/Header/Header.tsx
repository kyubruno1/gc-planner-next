"use client"; // se estiver no app router e for componente client

import Link from "next/link";
import { usePathname } from "next/navigation"; // app router

export function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Equip" },
    { href: "/visual", label: "Visual" },
    // ...
  ];

  const baseLink =
    "inline-block w-[5rem] text-center bg-bgpagelight px-[10px] py-[10px] rounded-[10px] border-[3px] border-primary border-b-0 shadow-[0px_0px_0px_3px_#415870] font-bold mb-[-10px]";
  const activeLink = "bg-bgtextdark font-bold text-white";

  return (
    <nav>
      <ul className="flex gap-2 px-5 mb-[-5px] mt-4">
        {navLinks.map(({ href, label }) => {
          const isActive = pathname === href;

          return (
            <li key={href}>
              <Link href={href} className={`${baseLink} ${isActive ? activeLink : ""}`}>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
