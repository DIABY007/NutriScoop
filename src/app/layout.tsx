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
    default: "Aurore AgroVital — Suivi nutritionnel & sportif",
    template: "%s | Aurore AgroVital",
  },
  description:
    "Application de suivi nutritionnel et sportif par challenges.",
};

const navItems = [
  {
    label: "Mes Challenges",
    href: "/",
    icon: (
      <svg className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
      </svg>
    ),
  },
  {
    label: "Suivi nutritionnel",
    href: "/suivi-nutritionnel",
    icon: (
      <svg className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
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
        {/* ─── Barre mobile (top) ─── */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-surface border-b border-border lg:hidden safe-area-top">
          <Link
            href="/"
            className="flex items-center gap-2 text-foreground font-semibold text-lg"
          >
            <span className="flex items-center justify-center size-8 rounded-lg bg-primary text-primary-foreground text-sm font-bold">
              A
            </span>
            <span>Aurore AgroVital</span>
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
                A
              </span>
              <span className="text-foreground font-semibold text-lg">
                Aurore AgroVital
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
                Aurore AgroVital v2.0
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