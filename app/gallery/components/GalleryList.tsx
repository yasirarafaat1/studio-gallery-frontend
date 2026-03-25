"use client";
import { Image as ImageIcon, Video } from "lucide-react";
import type { GalleryGroup } from "./galleryHelpers";

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
                {group.description ? <p className="mt-2 text-sm text-[var(--muted)]">{group.description}</p> : null}
              </div>
              <div className="flex flex-wrap gap-3">
                {group.imageCount > 0 ? (
                  <button
                    onClick={() => onOpen(group.id, "image")}
                    className="flex items-center justify-center cursor-pointer rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/80 transition hover:border-white/40"
                    aria-label="Open images"
                    title="Open images"
                  >
                    <span className="inline-flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      <span className="text-xs font-semibold">{group.imageCount}</span>
                    </span>
                  </button>
                ) : null}
                {group.videoCount > 0 ? (
                  <button
                    onClick={() => onOpen(group.id, "video")}
                    className="flex items-center justify-center cursor-pointer rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/80 transition hover:border-white/40"
                    aria-label="Open videos"
                    title="Open videos"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      <span className="text-xs font-semibold">{group.videoCount}</span>
                    </span>
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
