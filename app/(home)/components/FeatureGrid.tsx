const features = [
  {
    title: "Per-client access",
    description: "Map every album to an approved email. Clients see only what belongs to them.",
  },
  {
    title: "OTP + token auth",
    description: "One-time passwords verify identity quickly, with one-day admin sessions.",
  },
  {
    title: "Cloudinary delivery",
    description: "Images and videos stream from the cloud with fast previews and downloads.",
  },
  {
    title: "Admin control center",
    description: "Upload, approve clients, and send access notifications in a clean workflow.",
  },
];

export default function FeatureGrid() {
  return (
    <section id="features" className="grid gap-6 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">Features</p>
        <h2 className="section-title text-3xl sm:text-4xl">
          Built for studios that want polish and privacy.
        </h2>
        <p className="max-w-xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
          Every interaction is crafted to feel premium: automated OTP access, curated galleries, and clear
          admin ownership. Your clients get clarity, not confusion.
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