const stats = [
  { value: "120+", label: "Studios onboarded" },
  { value: "98%", label: "OTP success rate" },
  { value: "24h", label: "Average delivery time" },
  { value: "4K", label: "Assets shared daily" },
];

export default function StatsStrip() {
  return (
    <section className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-center sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col gap-2">
          <p className="section-title text-2xl font-semibold text-white">{stat.value}</p>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{stat.label}</p>
        </div>
      ))}
    </section>
  );
}