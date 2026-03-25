const steps = [
  { title: "Client enters email", meta: "OTP sent instantly" },
  { title: "OTP verification", meta: "Single-use code" },
  { title: "Gallery unlocked", meta: "Read-only access" },
];

export default function HeroCard() {
  return (
    <div className="glass relative overflow-hidden p-6">
      <div className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/70">
        Live Preview
      </div>
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Client access</p>
          <h3 className="section-title mt-2 text-2xl">Login panel</h3>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">Email</p>
          <div className="mt-2 h-10 rounded-xl border border-white/10 bg-white/5" />
          <div className="mt-3 flex items-center gap-2">
            <div className="h-10 flex-1 rounded-xl border border-white/10 bg-white/5" />
            <div className="h-10 w-28 rounded-xl bg-white text-center text-xs font-semibold text-black leading-10">
              Send OTP
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold text-white/90">{step.title}</p>
                <p className="text-xs text-[var(--muted)]">{step.meta}</p>
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-xs text-white/70">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute -bottom-16 -right-12 h-40 w-40 rounded-full bg-[var(--accent-2)]/30 blur-3xl" />
    </div>
  );
}