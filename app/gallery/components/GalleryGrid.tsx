"use client";
import { useMemo, useState } from "react";
import { ArrowLeft, Image as ImageIcon, ListFilter, Video } from "lucide-react";
import GalleryItemCard from "./GalleryItemCard";
import type { GalleryGroup, MediaItem } from "./galleryHelpers";

type Props = {
  group: GalleryGroup;
  activeType: "image" | "video";
  items: MediaItem[];
  favorites: string[];
  loading: boolean;
  busyFavoriteId: string | null;
  actionMessage?: string | null;
  onOpenMedia: (id: string) => void;
  onBack: () => void;
  onSwitchType: (type: "image" | "video") => void;
  onToggleFavorite: (id: string) => void;
};

export default function GalleryGrid({
  group,
  activeType,
  items,
  favorites,
  loading,
  busyFavoriteId,
  actionMessage,
  onOpenMedia,
  onBack,
  onSwitchType,
  onToggleFavorite,
}: Props) {
  const [sortKey, setSortKey] = useState("newest");
  const sortedItems = useMemo(() => {
    const next = [...items];
    const byTitle = (a: MediaItem, b: MediaItem) => (a.title || "").localeCompare(b.title || "");
    const dateValue = (value?: string) => (value ? new Date(value).getTime() : 0);
    const byDate = (a: MediaItem, b: MediaItem) => dateValue(a.createdAt) - dateValue(b.createdAt);
    switch (sortKey) {
      case "oldest":
        next.sort(byDate);
        return next;
      case "title-asc":
        next.sort(byTitle);
        return next;
      case "title-desc":
        next.sort((a, b) => -byTitle(a, b));
        return next;
      case "newest":
      default:
        next.sort((a, b) => -byDate(a, b));
        return next;
    }
  }, [items, sortKey]);

  return (
    <div className="flex flex-col gap-6">
      <div className="glass p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Gallery open</p>
            <h3 className="section-title text-2xl text-white">{group.title}</h3>
            {group.description ? <p className="mt-2 text-sm text-[var(--muted)]">{group.description}</p> : null}
          </div>
          <button
            onClick={onBack}
            className="rounded-full cursor-pointer border border-white/20 p-2 text-white/80"
            aria-label="Back"
            title="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          {group.imageCount > 0 ? (
            <button
              onClick={() => onSwitchType("image")}
              className={`flex items-center justify-center cursor-pointer rounded-full border px-4 py-2 text-xs uppercase tracking-[0.3em] transition ${
                activeType === "image"
                  ? "border-white/60 bg-white font-semibold !text-black"
                  : "border-white/15 text-white/70 hover:border-white/40"
              }`}
              aria-label="Images"
              title="Images"
            >
              <span className="inline-flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                <span className="text-xs font-semibold">{group.imageCount}</span>
              </span>
            </button>
          ) : null}
          {group.videoCount > 0 ? (
            <button
              onClick={() => onSwitchType("video")}
              className={`flex items-center justify-center cursor-pointer rounded-full border px-4 py-2 text-xs uppercase tracking-[0.3em] transition ${
                activeType === "video"
                  ? "border-white/60 bg-white font-semibold !text-black"
                  : "border-white/15 text-white/70 hover:border-white/40"
              }`}
              aria-label="Videos"
              title="Videos"
            >
              <span className="inline-flex items-center gap-2">
                <Video className="h-4 w-4" />
                <span className="text-xs font-semibold">{group.videoCount}</span>
              </span>
            </button>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Items</p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--muted)]">
          <label className="flex items-center gap-2" title="Sort">
            <ListFilter className="h-4 w-4" />
            <span className="sr-only">Sort</span>
            <select
              value={sortKey}
              onChange={(event) => setSortKey(event.target.value)}
              className="h-9 rounded-full border border-white/20 bg-transparent px-3 text-xs text-white/80 outline-none focus:border-white/40"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
            </select>
          </label>
          {actionMessage ? <span className="text-xs text-emerald-200">{actionMessage}</span> : null}
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="rounded-2xl border border-white/10 bg-white/5 p-3 animate-pulse"
            >
              <div className="h-40 rounded-xl bg-white/10" />
              <div className="mt-3 h-4 w-3/5 rounded bg-white/10" />
              <div className="mt-3 h-9 rounded bg-white/10" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="glass p-6 text-sm text-[var(--muted)]">No items in this view.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedItems.map((item) => (
            <GalleryItemCard
              key={item._id}
              item={item}
              isFavorite={favorites.includes(item._id)}
              busy={busyFavoriteId === item._id}
              onToggleFavorite={() => onToggleFavorite(item._id)}
              onOpen={() => onOpenMedia(item._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
