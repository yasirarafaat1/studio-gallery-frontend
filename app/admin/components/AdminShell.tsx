"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearAdminAuth, getAdminUser } from "../../lib/auth";

type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

const tabs = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Upload", href: "/admin/upload" },
  { label: "Gallery", href: "/admin/gallery" },
];

export default function AdminShell({ title, subtitle, children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useMemo(() => getAdminUser(), []);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const handleLogout = () => {
    clearAdminAuth();
    router.push("/admin/login");
  };

  if (!hydrated) {
    return (
      <div className="page-wrap flex-1">
        <div className="bg-aurora" />
        <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-12">
          <div className="glass p-6 text-sm text-[var(--muted)]">Loading admin...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page-wrap flex-1">
        <div className="bg-aurora" />
        <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-12">
          <div className="glass p-6 text-sm text-[var(--muted)]">Please login as admin.</div>
          <Link href="/admin/login" className="text-sm text-white/70 hover:text-white">
            Go to admin login
          </Link>
        </div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="page-wrap flex-1">
        <div className="bg-aurora" />
        <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-12">
          <div className="glass p-6 text-sm text-red-300">This area is for admins only.</div>
          <Link href="/" className="text-sm text-white/70 hover:text-white">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrap flex-1">
      <div className="bg-aurora" />
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 sm:px-10">
        <div className="glass p-6">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Admin</p>
                <h1 className="section-title text-3xl">{title}</h1>
                {subtitle ? <p className="mt-2 text-sm text-[var(--muted)]">{subtitle}</p> : null}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {tabs.map((tab) => {
                const isActive = pathname === tab.href;
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.3em] transition ${isActive
                      ? "border-white/60 bg-white font-semibold !text-black"
                      : "border-white/15 text-white/70 hover:border-white/40"
                      }`}
                  >
                    {tab.label}
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="rounded-full border border-white/20 bg-red-500 px-4 py-2 text-sm text-white/90 transition hover:border-white/50"
              >
                Logout
              </button>
            </div>
          </header>
        </div>
        {children}
      </div>
    </div>
  );
}
