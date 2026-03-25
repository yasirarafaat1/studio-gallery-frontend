"use client";

type GalleryGroup = {
  id: string;
  title: string;
  description?: string;
  imageCount: number;
  videoCount: number;
  coverUrl: string;
  coverType: "image" | "video";
};

type Props = {
  groups: GalleryGroup[];
  onOpen: (id: string, type: "image" | "video") => void;
};

export default function GalleryList({ groups, onOpen }: Props) {
  if (groups.length === 0) {
    return <div className="glass p-6 text-sm text-[var(--muted)]">No galleries yet.</div>;
  }

  return (
    <div className="grid gap-6">
      {groups.map((group) => (
        <div key={group.id} className="glass p-6">
          <div className="grid gap-4 lg:grid-cols-5">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40">
              {group.coverType === "video" ? (
                <video className="h-48 w-48 object-cover" muted>
                  <source src={group.coverUrl} />
                </video>
              ) : (
                <img src={group.coverUrl} alt={group.title} className="h-48 w-48 object-cover" />
              )}
            </div>
            <div className="flex flex-col justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Gallery</p>
                <h3 className="section-title text-2xl text-white">{group.title}</h3>
                {group.description ? (
                  <p className="mt-2 text-sm text-[var(--muted)]">{group.description}</p>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-3">
                {group.imageCount > 0 ? (
                  <button
                    onClick={() => onOpen(group.id, "image")}
                    className="rounded-full cursor-pointer border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/80 transition hover:border-white/40"
                  >
                    Images ({group.imageCount})
                  </button>
                ) : null}
                {group.videoCount > 0 ? (
                  <button
                    onClick={() => onOpen(group.id, "video")}
                    className="rounded-full cursor-pointer border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/80 transition hover:border-white/40"
                  >
                    Videos ({group.videoCount})
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}