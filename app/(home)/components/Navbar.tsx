import Link from "next/link";

const navItems = [
  { label: "Features", href: "#features" },
  { label: "Flow", href: "#flow" },
  { label: "Gallery", href: "#gallery" },
];

export default function Navbar() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-lg font-semibold">
          SG
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--muted)]">Studio</p>
          <p className="section-title text-lg">Gallery</p>
        </div>
      </div>
      <nav className="hidden items-center gap-6 text-sm text-[var(--muted)] md:flex">
        {navItems.map((item) => (
          <a key={item.href} href={item.href} className="transition text-[var(--muted)] hover:text-white">
            {item.label}
          </a>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/90 transition hover:border-white/40"
        >
          Client Login
        </Link>
        <Link
          href="#features"
          className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90"
        >
          Explore
        </Link>
      </div>
    </header>
  );
}