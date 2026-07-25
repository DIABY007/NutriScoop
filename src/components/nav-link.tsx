"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type NavLinkProps = {
  href: string;
  label: string;
  icon: ReactNode;
  variant: "mobile" | "sidebar";
};

export function NavLink({ href, label, icon, variant }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  if (variant === "mobile") {
    return (
      <Link
        href={href}
        className={`flex flex-col items-center justify-center gap-0.5 min-h-11 min-w-14 px-2 py-1 rounded-lg text-xs transition-colors ${
          isActive
            ? "text-primary bg-primary-light"
            : "text-muted hover:text-primary hover:bg-primary-light/50"
        }`}
        aria-current={isActive ? "page" : undefined}
      >
        {icon}
        <span className="truncate max-w-14">{label}</span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
        isActive
          ? "bg-sidebar-active text-sidebar-active-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-hover"
      }`}
      aria-current={isActive ? "page" : undefined}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}