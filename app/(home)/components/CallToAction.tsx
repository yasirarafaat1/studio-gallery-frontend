import Link from "next/link";

export default function CallToAction() {
  return (
    <section className="glass flex flex-col items-start justify-between gap-6 p-8 sm:flex-row sm:items-center">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">Ready to launch</p>
        <h2 className="section-title mt-3 text-3xl">Deliver your next shoot like a premium studio.</h2>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Give clients a secure OTP login, polished galleries, and instant downloads.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/login"
          className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
        >
          Open client login
        </Link>
        <Link
          href="#features"
          className="rounded-full border border-white/20 px-5 py-3 text-sm text-white/90 transition hover:border-white/50"
        >
          View features
        </Link>
      </div>
    </section>
  );
}