import Link from "next/link";
import AdminLoginForm from "./AdminLoginForm";

export default function AdminLoginShell() {
  return (
    <div className="page-wrap flex-1">
      <div className="bg-aurora" />
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-10 sm:px-10">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Admin access</p>
            <h1 className="section-title text-3xl">Studio control</h1>
          </div>
          <Link href="/" className="text-sm text-white/70 hover:text-white">
            Back to home
          </Link>
        </header>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="glass flex flex-col gap-4 p-6">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">Admin login</p>
            <h2 className="section-title text-2xl">Manage uploads and access.</h2>
            <p className="text-sm text-[var(--muted)]">
              Use your admin username or email and password. Sessions stay active for 1 day.
            </p>
          </div>
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}