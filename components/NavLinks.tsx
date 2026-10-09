"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { href: string; label: string };

export function NavLinks({ items, className }: { items: Item[]; className?: string }) {
  const pathname = usePathname() || "/";
  return (
    <>
      {items.map((n) => {
        const active = pathname === n.href || pathname.startsWith(`${n.href}/`);
        return (
          <Link key={n.href} href={n.href} className={className} aria-current={active ? "page" : undefined}>
            {n.label}
          </Link>
        );
      })}
    </>
  );
}
