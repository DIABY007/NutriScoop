import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { NavLink } from "@/components/nav-link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "NutriScoop — Suivi nutritionnel & sportif",
    template: "%s | NutriScoop",
  },
  description:
    "Application de suivi nutritionnel et sportif — Suivez vos repas, hydratation, sport et bien-être au quotidien.",
};

const navItems = [
  {
    label: "Tableau de bord",
    href: "/",
    icon: (
      <svg
        className="size-5 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
        />
      </svg>
    ),
  },
  {
    label: "Classement",
    href: "/classement",
    icon: (
      <svg
        className="size-5 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0 1 16.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 0 1-2.77.896m0 0a6.022 6.022 0 0 1-2.77-.896m0 0a6.023 6.023 0 0 1-2.77-.896"
        />
      </svg>
    ),
  },
  {
    label: "Nouveau Participant",
    href: "/nouveau-participant",
    icon: (
      <svg
        className="size-5 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
        />
      </svg>
    ),
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col lg:flex-row">
        {/* ─── Barre de navigation mobile (top) ─── */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-surface border-b border-border lg:hidden safe-area-top">
          <Link
            href="/"
            className="flex items-center gap-2 text-foreground font-semibold text-lg"
          >
            <span className="flex items-center justify-center size-8 rounded-lg bg-primary text-primary-foreground text-sm font-bold">
              N
            </span>
            <span>NutriScoop</span>
          </Link>

          <nav className="flex items-center gap-1" aria-label="Navigation mobile">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                href={item.href}
                label={item.label}
                icon={item.icon}
                variant="mobile"
              />
            ))}
          </nav>
        </header>

        {/* ─── Sidebar desktop (lg+) ─── */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 lg:border-r lg:border-border lg:bg-sidebar">
          <div className="flex flex-col flex-1 min-h-0">
            <div className="flex items-center gap-3 h-16 px-6 border-b border-border shrink-0">
              <span className="flex items-center justify-center size-9 rounded-xl bg-primary text-primary-foreground text-lg font-bold">
                N
              </span>
              <span className="text-foreground font-semibold text-lg">
                NutriScoop
              </span>
            </div>

            <nav className="flex-1 px-3 py-6 space-y-1" aria-label="Navigation principale">
              {navItems.map((item) => (
                <NavLink
                  key={item.label}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  variant="sidebar"
                />
              ))}
            </nav>

            <div className="px-3 py-4 border-t border-border shrink-0">
              <p className="text-xs text-muted-foreground px-3">
                NutriScoop v1.0
              </p>
            </div>
          </div>
        </aside>

        {/* ─── Contenu principal ─── */}
        <main className="flex-1 flex flex-col min-h-0 lg:min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}