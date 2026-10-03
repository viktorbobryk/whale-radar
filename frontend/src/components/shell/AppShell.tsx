"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const NAV = [
  { href: "/", label: "Radar", icon: IconRadar },
  { href: "/watchlist", label: "Watchlist", icon: IconList },
  { href: "/deck", label: "Deck", icon: IconDeck },
  { href: "/analytics", label: "Analytics", icon: IconChart },
  { href: "/alerts", label: "Alerts", icon: IconBell },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen md:grid md:grid-cols-[92px_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-screen flex-col items-center gap-1 border-r border-cyan/10 bg-[#07141e]/95 px-2 py-4 md:flex">
        {NAV.map((item) => (
          <NavLink key={item.href} {...item} active={isActive(pathname, item.href)} />
        ))}
        <div className="mt-auto">
          <NavLink href="/settings" label="Settings" icon={IconGear} active={isActive(pathname, "/settings")} />
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-cyan/10 bg-[#061018]/85 px-4 backdrop-blur-md">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/brand/mark.jpg"
              alt=""
              width={36}
              height={36}
              priority
              className="size-9 rounded-full"
            />
            <span className="leading-tight">
              <span className="block text-sm font-semibold tracking-[0.16em]">WHALE RADAR</span>
              <span className="block text-[10px] text-mist">Desktop v2.1.0</span>
            </span>
          </Link>
          <span className="ml-auto hidden rounded-full border border-cyan/25 px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] text-cyan sm:inline">
            PREVIEW
          </span>
          <Link
            href="/settings"
            aria-label="Settings"
            className="rounded-full border border-white/10 p-2 text-mist hover:text-white md:hidden"
          >
            <IconGear />
          </Link>
          <Link
            href="/alerts"
            aria-label="Alerts"
            className="relative rounded-full border border-white/10 p-2 text-mist hover:text-white"
          >
            <IconBell />
            <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-cyan" />
          </Link>
          <div className="flex items-center gap-2 rounded-full border border-white/10 py-1 pl-1 pr-3">
            <span className="grid size-7 place-items-center rounded-full bg-cyan/15 text-[10px] font-semibold text-cyan">
              AT
            </span>
            <span className="text-sm">AlphaTrader</span>
          </div>
        </header>
        <main className="px-4 py-4 pb-24 md:px-5 md:py-5 md:pb-6">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-cyan/15 bg-[#07141e]/95 px-1 py-1.5 backdrop-blur md:hidden">
        {NAV.map((item) => (
          <NavLink key={item.href} {...item} active={isActive(pathname, item.href)} compact />
        ))}
      </nav>
    </div>
  );
}

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  compact = false,
}: {
  href: string;
  label: string;
  icon: () => ReactNode;
  active: boolean;
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex flex-col items-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-medium ${
        active
          ? "bg-cyan/15 text-cyan shadow-[inset_0_0_0_1px_rgba(46,230,234,0.35)]"
          : "text-mist hover:bg-white/5 hover:text-white"
      } ${compact ? "flex-1" : "w-full"}`}
    >
      <Icon />
      <span>{label}</span>
    </Link>
  );
}

function IconRadar() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

function IconList() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M8 7h11M8 12h11M8 17h11" />
      <circle cx="4.5" cy="7" r="1" fill="currentColor" />
      <circle cx="4.5" cy="12" r="1" fill="currentColor" />
      <circle cx="4.5" cy="17" r="1" fill="currentColor" />
    </svg>
  );
}

function IconDeck() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function IconChart() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M4 19h16" />
      <path d="M6 16l4-5 3 3 5-7" />
    </svg>
  );
}

function IconBell() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M6 16h12l-1.2-2.2V10a4.8 4.8 0 0 0-9.6 0v3.8L6 16z" />
      <path d="M10 18a2 2 0 0 0 4 0" />
    </svg>
  );
}

function IconGear() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6 6l1.6 1.6M16.4 16.4 18 18M18 6l-1.6 1.6M7.6 16.4 6 18" />
    </svg>
  );
}
