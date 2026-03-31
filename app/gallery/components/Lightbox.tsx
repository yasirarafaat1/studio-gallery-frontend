"use client";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { MediaItem } from "./galleryHelpers";

type Props = {
  items: MediaItem[];
  activeIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export default function Lightbox({ items, activeIndex, onClose, onPrev, onNext }: Props) {
  const item = items[activeIndex];
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <button
        onClick={onClose}
        className="absolute right-3 top-3 cursor-pointer rounded-full border border-white/30 p-2 text-white sm:right-6 sm:top-6"
        aria-label="Close"
        title="Close"
      >
        <X className="h-4 w-4" />
      </button>
      <button
        onClick={onPrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full border border-white/20 p-2 text-white/90 sm:left-6"
        aria-label="Previous"
        title="Previous"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={onNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full border border-white/20 p-2 text-white/90 sm:right-6"
        aria-label="Next"
        title="Next"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-black">
        {item.resourceType === "video" ? (
          <video controls autoPlay className="max-h-[80vh] w-full bg-black">
            <source src={item.secureUrl} />
          </video>
        ) : (
          <img src={item.secureUrl} alt={item.title || "Media"} className="max-h-[80vh] w-full object-contain" />
        )}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 px-5 py-4 text-sm text-white/90">
          <span>{item.title || "Untitled"}</span>
          <span className="text-xs text-[var(--muted)]">
            {activeIndex + 1} / {items.length}
          </span>
        </div>
      </div>
    </div>
  );
}
