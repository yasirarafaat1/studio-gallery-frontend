import { Suspense } from "react";
import GalleryShell from "./components/GalleryShell";

export default function GalleryPage() {
  return (
    <Suspense fallback={<div className="page-wrap flex-1"><div className="bg-aurora" /><div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-12"><div className="glass p-6 text-sm text-[var(--muted)]">Loading gallery...</div></div></div>}>
      <GalleryShell />
    </Suspense>
  );
}
