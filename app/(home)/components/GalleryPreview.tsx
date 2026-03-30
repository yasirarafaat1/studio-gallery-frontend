const items = [
  {
    title: "Wedding | Aanya & Dev",
    count: "142 photos · 6 films",
    tag: "Available",
  },
  {
    title: "Studio Portraits | Karan",
    count: "56 photos · 2 films",
    tag: "New",
  },
  {
    title: "Product Shoot | Niva",
    count: "88 photos · 1 film",
    tag: "Delivered",
  },
];

export default function GalleryPreview() {
  return (
    <section id="gallery" className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="glass p-6">
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">Gallery</p>
        <h2 className="section-title mt-3 text-3xl">Your shoots, neatly organized.</h2>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Open a gallery and see exactly how many photos and videos are ready for you.
        </p>
        <div className="mt-6 space-y-4">
          {items.map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-white/90">{item.title}</h3>
                {/* <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/70">
                  {item.tag}
                </span> */}
              </div>
              <p className="mt-2 text-sm text-[var(--muted)]">{item.count}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col justify-center gap-5">
        <div className="glass p-6">
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">One inbox</p>
          <h3 className="section-title mt-3 text-2xl">One link, just for you.</h3>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Login with your email OTP and land straight in your private gallery.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-white/0 to-white/10 p-6">
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">Favorites ready</p>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Mark favorites, download picks, and revisit them anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
