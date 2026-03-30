const features = [
  {
    title: "Private access",
    description: "Your gallery is visible only to your email address.",
  },
  {
    title: "OTP login",
    description: "Secure, quick sign-in without passwords or links.",
  },
  {
    title: "HD photos & video",
    description: "Stream or download in full quality whenever you need.",
  },
  {
    title: "Favorites list",
    description: "Mark favorites and come back to them anytime.",
  },
];

export default function FeatureGrid() {
  return (
    <section id="features" className="grid gap-6 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">Features</p>
        <h2 className="section-title text-3xl sm:text-4xl">
          A clean, premium viewing experience for every client.
        </h2>
        <p className="max-w-xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
          Everything you need to view, choose, and download your shoot — simple, secure, and
          distraction-free.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {features.map((feature) => (
          <div key={feature.title} className="glass p-5">
            <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
