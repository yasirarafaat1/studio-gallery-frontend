const steps = [
  {
    title: "Upload the shoot",
    detail: "Drag photos and videos once. Cloudinary handles speed and quality.",
  },
  {
    title: "Assign client email",
    detail: "Link the gallery to one or more approved client emails.",
  },
  {
    title: "OTP login",
    detail: "Client verifies with an OTP and lands on their private gallery.",
  },
  {
    title: "Download delivered",
    detail: "Clients can view and download without editing or sharing controls.",
  },
];

export default function Process() {
  return (
    <section id="flow" className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="flex flex-col gap-4">
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">Flow</p>
        <h2 className="section-title text-3xl sm:text-4xl">Smooth from upload to delivery.</h2>
        <p className="text-sm leading-relaxed text-[var(--muted)] sm:text-base">
          The workflow is designed so you never chase files again. Clients only see what they should,
          and you keep full control over the experience.
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