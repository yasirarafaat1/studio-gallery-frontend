"use client";
import { Crown, Loader2, Trash2 } from "lucide-react";

type MediaItem = {
  _id: string;
  title?: string;
  secureUrl: string;
  resourceType?: string;
};

type Props = {
  item: MediaItem;
  isCover: boolean;
  selected: boolean;
  deleting: boolean;
  onToggleSelect: () => void;
  onOpen: () => void;
  onSetCover: () => void;
  onDelete: () => void;
};

export default function GalleryItemCard({
  item,
  isCover,
  selected,
  deleting,
  onToggleSelect,
  onOpen,
  onSetCover,
  onDelete,
}: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-left">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-white/60">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={selected} onChange={onToggleSelect} />
          Select
        </label>
        {isCover ? <Crown className="h-4 w-4 text-emerald-200" aria-label="Cover" title="Cover" /> : null}
      </div>
      <button onClick={onOpen} className="mt-2 w-full text-left">
        <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40">
          {item.resourceType === "video" ? (
            <video className="h-40 w-full object-cover" muted>
              <source src={item.secureUrl} />
            </video>
          ) : (
            <img src={item.secureUrl} alt={item.title || "Media"} className="h-40 w-full object-cover" />
          )}
        </div>
        <p className="mt-3 text-sm font-semibold text-white">{item.title || "Untitled"}</p>
      </button>
      <div className="flex items-center gap-2 mt-3">
        <button
          onClick={onSetCover}
          className="rounded-xl cursor-pointer border border-white/20 px-3 py-2 text-xs font-semibold text-white/80"
          aria-label="Set as cover"
          title="Set as cover"
        >
          <Crown className="h-4 w-4" />
        </button>
        <button
          onClick={onDelete}
          disabled={deleting}
          className="rounded-xl cursor-pointer border border-red-400/40 px-3 py-2 text-xs font-semibold text-red-200 transition hover:border-red-300/70 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Delete"
          title="Delete"
        >
          {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
