"use client";
import { Download, Heart, Loader2 } from "lucide-react";

type MediaItem = {
  _id: string;
  title?: string;
  secureUrl: string;
  resourceType?: string;
};

type Props = {
  item: MediaItem;
  isFavorite: boolean;
  busy: boolean;
  onToggleFavorite: () => void;
  onOpen: () => void;
};

export default function GalleryItemCard({ item, isFavorite, busy, onToggleFavorite, onOpen }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-left">
      <div className="gap-3">
        <div className="flex-1">
          <button onClick={onOpen} className="w-full text-left">
            <div className="overflow-hidden cursor-pointer rounded-xl border border-white/10 bg-black/40">
              {item.resourceType === "video" ? (
                <video className="h-40 w-full object-cover" muted>
                  <source src={item.secureUrl} />
                </video>
              ) : (
                <img src={item.secureUrl} alt={item.title || "Media"} className="h-40 w-full object-cover" />
              )}
            </div>
          </button>
        </div>
        <p className="mt-3 text-sm font-semibold text-white">{item.title || "Untitled"}</p>
        <div className="flex flex-row items-center justify-start gap-3 mt-3">
          <button
            onClick={onToggleFavorite}
            className={`cursor-pointer rounded-[5px] border py-2 px-3 transition ${isFavorite ? "border-rose-400/60 text-rose-200" : "border-white/20 text-white/80"
              }`}
            aria-label={isFavorite ? "Remove favorite" : "Add favorite"}
            title={isFavorite ? "Remove favorite" : "Add favorite"}
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Heart className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
            )}
          </button>
          <a
            href={item.secureUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-[5px] border border-white/20 py-2 px-3 text-white/80 transition"
            aria-label="Download"
            title="Download"
          >
            <Download className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
