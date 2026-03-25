"use client";

import { useState } from "react";
import { apiFetchAdmin } from "../../../lib/api";

type Props = {
  onUploaded: () => void;
};

export default function UploadForm({ onUploaded }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (files.length === 0 || loading) return;
    setLoading(true);
    setMessage(null);
    try {
      const form = new FormData();
      files.forEach((file) => form.append("files", file));
      form.append("title", title);
      form.append("description", description);

      await apiFetchAdmin("/api/media/upload", {
        method: "POST",
        body: form,
      });

      setMessage(`Uploaded ${files.length} file(s).`);
      setTitle("");
      setDescription("");
      setFiles([]);
      onUploaded();
    } catch (err) {
      setMessage((err as Error).message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleUpload();
  };

  return (
    <form onSubmit={handleSubmit} className="glass p-6">
      <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">Upload media</p>
      <div className="mt-4 grid gap-3">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Gallery title"
          className="h-11 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none focus:border-white/30"
        />
        <input
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Description (optional)"
          className="h-11 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none focus:border-white/30"
        />
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={(event) => setFiles(Array.from(event.target.files || []))}
          className="text-xs text-[var(--muted)] file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-xs file:font-semibold file:text-black"
        />
        <button
          type="submit"
          disabled={files.length === 0 || loading}
          className="rounded-2xl bg-white py-2 text-sm font-semibold text-black transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Uploading..." : `Upload (${files.length || 0})`}
        </button>
        {message ? <p className="text-xs text-white/70">{message}</p> : null}
      </div>
    </form>
  );
}
