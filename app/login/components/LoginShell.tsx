import Link from "next/link";
import LoginForm from "./LoginForm";

export default function LoginShell() {
  return (
    <div className="page-wrap flex-1">
      <div className="bg-aurora" />
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10 sm:px-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-lg font-semibold">
              SG
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Client login</p>
              <p className="section-title text-lg">Studio Gallery</p>
            </div>
          </div>
          <Link href="/" className="text-sm text-white/80 hover:text-white">
            Back to home
          </Link>
        </header>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="glass flex flex-col justify-between gap-6 p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">Secure access</p>
              <h1 className="section-title mt-3 text-3xl">Enter your email to receive OTP.</h1>
              <p className="mt-3 text-sm text-[var(--muted)]">
                Access stays private. You will see only the galleries assigned to your email.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-[var(--muted)]">
              <p className="text-white/90">How it works</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>1. Enter your email and request OTP.</li>
                <li>2. Check your inbox for the 6-digit code.</li>
                <li>3. Login to view and download your gallery.</li>
              </ul>
            </div>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}