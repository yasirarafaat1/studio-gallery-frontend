const steps = [
  {
    title: "Request OTP",
    detail: "Enter your email to receive a one-time login code.",
  },
  {
    title: "Verify login",
    detail: "Use the OTP to unlock your private gallery.",
  },
  {
    title: "Browse your shoot",
    detail: "View photos and videos in full screen, sorted and clean.",
  },
  {
    title: "Download & favorite",
    detail: "Save your picks and download in high quality.",
  },
];

export default function Process() {
  return (
    <section id="flow" className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="flex flex-col gap-4">
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">Flow</p>
        <h2 className="section-title text-3xl sm:text-4xl">From OTP to download in minutes.</h2>
        <p className="text-sm leading-relaxed text-[var(--muted)] sm:text-base">
          A simple flow designed for clients: quick login, clear galleries, and instant downloads.
        </p>
      </div>
      <div className="grid gap-4">
        {steps.map((step, index) => (
          <div key={step.title} className="glass flex flex-col gap-2 p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">{step.title}</h3>
              <span className="text-xs uppercase tracking-[0.3em] text-white/50">0{index + 1}</span>
            </div>
            <p className="text-sm text-[var(--muted)]">{step.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
