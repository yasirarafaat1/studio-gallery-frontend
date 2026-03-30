import Link from "next/link";

export default function CallToAction() {
  return (
    <section className="glass flex flex-col items-start justify-between gap-6 p-8 sm:flex-row sm:items-center">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">Ready to view</p>
        <h2 className="section-title mt-3 text-3xl">Open your gallery in seconds.</h2>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Login with your email OTP to view and download your shoot.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/login"
          className="rounded-full border border-white/20 px-5 py-3 text-sm text-white/90 transition hover:border-white/50"
        >
          Login
        </Link>
      </div>
    </section>
  );
}
