import Link from "next/link";
import HeroCard from "./HeroCard";

const badges = ["Private galleries", "OTP access", "Download control", "Cloud delivery"];

export default function Hero() {
  return (
    <section className="grid items-center gap-12 py-8 md:py-5 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="stagger flex flex-col gap-6">
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">Studio client vault</p>
        <h1 className="section-title text-4xl font-semibold leading-tight sm:text-5xl">
          Share finished shoots with confidence, not clutter.
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
          Upload images and videos once, then unlock each client's private gallery with a secure OTP login.
          Your studio stays polished while clients get instant, read-only access.
        </p>
        <div className="flex flex-wrap gap-2">
          {badges.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80"
            >
              {badge}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/login"
            className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-black transition hover:brightness-110"
          >
            Login
          </Link>
          <Link
            href="#gallery"
            className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white/90 transition hover:border-white/50"
          >
            See gallery flow
          </Link>
        </div>
      </div>
      <HeroCard />
    </section>
  );
}