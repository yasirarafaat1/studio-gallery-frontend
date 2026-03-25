"use client";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Image as ImageIcon, ListFilter, Pencil, Trash2, Upload, UserPlus, Video, XCircle } from "lucide-react";
import GalleryIconButton from "./GalleryIconButton";
import GalleryItemCard from "./GalleryItemCard";
import GallerySidePanel from "./GallerySidePanel";

type MediaItem = {
  _id: string;
  title?: string;
  description?: string;
  secureUrl: string;
  resourceType?: string;
  isCover?: boolean;
  createdAt?: string;
};

type GalleryGroup = {
  id: string;
  title: string;
  description?: string;
  imageCount: number;
  videoCount: number;
};

type Props = {
  group: GalleryGroup;
  activeType: "image" | "video";
  items: MediaItem[];
  loading?: boolean;
  editTitle: string;
  editDescription: string;
  assignEmails: string;
  assignedEmails: string[];
  removingEmail: string | null;
  coverId: string | null;
  saving: boolean;
  uploading: boolean;
  assigning: boolean;
  deletingId?: string | null;
  actionMessage?: string | null;
  onOpenMedia: (id: string) => void;
  onBack: () => void;
  onSwitchType: (type: "image" | "video") => void;
  onChangeTitle: (value: string) => void;
  onChangeDescription: (value: string) => void;
  onChangeAssignEmails: (value: string) => void;
  onSaveGallery: () => void;
  onUploadFiles: (files: File[]) => Promise<void>;
  onAssignEmails: () => Promise<void>;
  onRemoveEmail: (email: string) => void;
  onDeleteItem: (id: string) => Promise<void>;
  onDeleteMany: (ids: string[]) => Promise<void>;
  onDeleteGallery: () => Promise<void>;
  onSetCover: (id: string) => Promise<void>;
};

export default function GalleryGrid({
  group,
  activeType,
  items,
  loading = false,
  editTitle,
  editDescription,
  assignEmails,
  assignedEmails,
  removingEmail,
  coverId,
  saving,
  uploading,
  assigning,
  deletingId,
  actionMessage,
  onOpenMedia,
  onBack,
  onSwitchType,
  onChangeTitle,
  onChangeDescription,
  onChangeAssignEmails,
  onSaveGallery,
  onUploadFiles,
  onAssignEmails,
  onRemoveEmail,
  onDeleteItem,
  onDeleteMany,
  onDeleteGallery,
  onSetCover,
}: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [inputKey, setInputKey] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [panel, setPanel] = useState<"edit" | "assign" | "upload" | null>(null);
  const [sortKey, setSortKey] = useState("newest");
  useEffect(() => {
    setSelectedIds((prev) => prev.filter((id) => items.some((item) => item._id === id)));
  }, [items]);
  const selectedCount = selectedIds.length;
  const sortedItems = useMemo(() => {
    const next = [...items];
    const byTitle = (a: MediaItem, b: MediaItem) => {
      const aTitle = (a.title || "").toLowerCase();
      const bTitle = (b.title || "").toLowerCase();
      return aTitle.localeCompare(bTitle);
    };
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
  const handleUpload = async (uploadFiles: File[]) => {
    if (uploadFiles.length === 0 || uploading) return;
    await onUploadFiles(uploadFiles);
    setFiles([]);
    setInputKey((prev) => prev + 1);
  };
  const handleDelete = async (id: string, title?: string) => {
    const label = title || "this item";
    if (!window.confirm(`Delete ${label}?`)) return;
    await onDeleteItem(id);
  };
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]));
  };
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedIds.length} selected item(s)?`)) return;
    await onDeleteMany(selectedIds);
    setSelectedIds([]);
  };
  const handleDeleteGallery = async () => {
    if (!window.confirm("Delete entire gallery?")) return;
    await onDeleteGallery();
    setSelectedIds([]);
  };
  const handleSetCover = async (id: string) => {
    await onSetCover(id);
  };
  return (
    <div className="relative flex flex-col gap-6">
      <div className="glass p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Gallery open</p>
            <h3 className="section-title text-2xl text-white">{group.title}</h3>
            {group.description ? <p className="mt-2 text-sm text-[var(--muted)]">{group.description}</p> : null}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <GalleryIconButton onClick={() => setPanel("edit")} title="Edit gallery" className="rounded-full border cursor-pointer border-white/15 p-2 text-white/80 transition hover:border-white/40"><Pencil className="h-4 w-4" /></GalleryIconButton>
            <GalleryIconButton onClick={() => setPanel("assign")} title="Assign access" className="rounded-full border cursor-pointer border-white/15 p-2 text-white/80 transition hover:border-white/40"><UserPlus className="h-4 w-4" /></GalleryIconButton>
            <GalleryIconButton onClick={() => setPanel("upload")} title="Upload files" className="rounded-full border cursor-pointer border-white/15 p-2 text-white/80 transition hover:border-white/40"><Upload className="h-4 w-4" /></GalleryIconButton>
            <GalleryIconButton onClick={handleDeleteGallery} title="Delete gallery" className="rounded-full border cursor-pointer border-red-400/50 p-2 text-red-200"><Trash2 className="h-4 w-4" /></GalleryIconButton>
            <GalleryIconButton onClick={onBack} title="Back to galleries" className="rounded-full border cursor-pointer border-white/20 p-2 text-white/80"><ArrowLeft className="h-4 w-4" /></GalleryIconButton>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          {group.imageCount > 0 ? (
            <button
              onClick={() => onSwitchType("image")}
              className={`flex items-center justify-center gap-2 cursor-pointer rounded-full border px-4 py-2 text-xs uppercase tracking-[0.3em] transition ${
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
                <span className="sr-only">Images</span>
              </span>
            </button>
          ) : null}
          {group.videoCount > 0 ? (
            <button
              onClick={() => onSwitchType("video")}
              className={`flex items-center justify-center gap-2 cursor-pointer rounded-full border px-4 py-2 text-xs uppercase tracking-[0.3em] transition ${
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
                <span className="sr-only">Videos</span>
              </span>
            </button>
          ) : null}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Items</p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--muted)]">
          <label className="flex items-center gap-2 cursor-pointer" title="Sort">
            <ListFilter className="h-4 w-4" />
            <span className="sr-only">Sort</span>
            <select
              value={sortKey}
              onChange={(event) => setSortKey(event.target.value)}
              className="h-9 cursor-pointer rounded-full border border-white/20 bg-transparent px-3 text-xs text-white/80 outline-none focus:border-white/40"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
            </select>
          </label>
          <span>Selected: {selectedCount}</span>
          <GalleryIconButton onClick={handleDeleteSelected} disabled={selectedCount === 0} title="Delete selected" className="rounded-full cursor-pointer border border-red-400/40 p-2 text-red-200 transition disabled:cursor-not-allowed disabled:opacity-60"><Trash2 className="h-4 w-4" /></GalleryIconButton>
          <GalleryIconButton onClick={() => setSelectedIds([])} disabled={selectedCount === 0} title="Clear selection" className="rounded-full cursor-pointer border border-white/20 p-2 text-white/80 transition disabled:cursor-not-allowed disabled:opacity-60"><XCircle className="h-4 w-4" /></GalleryIconButton>
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
              isCover={coverId === item._id}
              selected={selectedIds.includes(item._id)}
              deleting={deletingId === item._id}
              onToggleSelect={() => toggleSelect(item._id)}
              onOpen={() => onOpenMedia(item._id)}
              onSetCover={() => handleSetCover(item._id)}
              onDelete={() => handleDelete(item._id, item.title)}
            />
          ))}
        </div>
      )}
      <GallerySidePanel
        panel={panel}
        onClose={() => setPanel(null)}
        editTitle={editTitle}
        editDescription={editDescription}
        assignEmails={assignEmails}
        assignedEmails={assignedEmails}
        removingEmail={removingEmail}
        saving={saving}
        uploading={uploading}
        assigning={assigning}
        actionMessage={actionMessage}
        files={files}
        inputKey={inputKey}
        onChangeTitle={onChangeTitle}
        onChangeDescription={onChangeDescription}
        onChangeAssignEmails={onChangeAssignEmails}
        onSaveGallery={onSaveGallery}
        onAssignEmails={onAssignEmails}
        onRemoveEmail={onRemoveEmail}
        onUploadFiles={handleUpload}
        setFiles={setFiles}
      />
    </div>
  );
}

