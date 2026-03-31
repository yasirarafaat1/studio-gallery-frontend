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
    <div className="space-y-3">
      {groups.map((group) => (
        <div key={group.id} className="glass p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40 sm:h-20 sm:w-28">
              {group.coverType === "video" ? (
                <video className="h-24 w-full object-cover sm:h-20 sm:w-28" muted>
                  <source src={group.coverUrl} />
                </video>
              ) : (
                <img src={group.coverUrl} alt={group.title} className="h-24 w-full object-cover sm:h-20 sm:w-28" />
              )}
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)]">Gallery</p>
                <h3 className="section-title text-xl text-white break-words">{group.title}</h3>
                {group.description ? (
                  <p className="mt-1 text-sm text-[var(--muted)] break-words">{group.description}</p>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2">
                {group.imageCount > 0 ? (
                  <button
                    onClick={() => onOpen(group.id, "image")}
                    className="flex items-center justify-center cursor-pointer rounded-full border border-white/15 bg-white/5 px-3 py-2 text-[10px] uppercase tracking-[0.3em] text-white/80 transition hover:border-white/40"
                    aria-label="Open images"
                    title="Open images"
                  >
                    <span className="inline-flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      <span className="text-[10px] font-semibold">{group.imageCount}</span>
                    </span>
                  </button>
                ) : null}
                {group.videoCount > 0 ? (
                  <button
                    onClick={() => onOpen(group.id, "video")}
                    className="flex items-center justify-center cursor-pointer rounded-full border border-white/15 bg-white/5 px-3 py-2 text-[10px] uppercase tracking-[0.3em] text-white/80 transition hover:border-white/40"
                    aria-label="Open videos"
                    title="Open videos"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      <span className="text-[10px] font-semibold">{group.videoCount}</span>
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
