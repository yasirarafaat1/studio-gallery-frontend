"use client";

import AdminShell from "../../components/AdminShell";
import UploadForm from "./UploadForm";

const tips = [
  "Upload multiple files at once for faster delivery.",
  "Use clear titles so clients know what they are viewing.",
  "Large videos may take extra time to process.",
];

export default function UploadShell() {
  return (
    <AdminShell title="Upload" subtitle="Upload images and videos to the client gallery.">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <UploadForm onUploaded={() => undefined} />
        <div className="flex flex-col gap-4">
          <div className="glass p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Quality notes</p>
            <div className="mt-4 space-y-3 text-sm text-[var(--muted)]">
              {tips.map((tip) => (
                <p key={tip}>{tip}</p>
              ))}
            </div>
          </div>
          <div className="glass p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Accepted</p>
            <p className="mt-2 text-sm text-white/90">Images, videos, and reels.</p>
            <p className="mt-2 text-xs text-[var(--muted)]">Each file is uploaded to Cloudinary.</p>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}