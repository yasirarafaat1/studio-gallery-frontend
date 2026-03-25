"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetchAdmin } from "../../../lib/api";
import { clearAdminAuth, getAdminUser } from "../../../lib/auth";
import AdminShell from "../../components/AdminShell";
import GalleryList from "./GalleryList";
import GalleryGrid from "./GalleryGrid";
import Lightbox from "./Lightbox";
import { buildGroupId, groupMedia, pickCover } from "./galleryHelpers";
import type { GalleryGroup, MediaItem } from "./galleryHelpers";

export default function GalleryShell() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [media, setMedia] = useState<MediaItem[]>([]), [loading, setLoading] = useState(true), [error, setError] = useState<string | null>(null), [actionMessage, setActionMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false), [uploading, setUploading] = useState(false), [assigning, setAssigning] = useState(false), [deletingId, setDeletingId] = useState<string | null>(null);
  const [removingEmail, setRemovingEmail] = useState<string | null>(null), [editTitle, setEditTitle] = useState(""), [editDescription, setEditDescription] = useState(""), [assignEmails, setAssignEmails] = useState(""), [coverId, setCoverId] = useState<string | null>(null);
  const user = useMemo(() => getAdminUser(), []), [hydrated, setHydrated] = useState(false);
  const groups = useMemo(() => groupMedia(media), [media]), galleryParam = searchParams.get("gallery"), typeParam = searchParams.get("type"), mediaParam = searchParams.get("mediaId"), activeGroup = groups.find((group) => group.id === galleryParam), defaultType = activeGroup?.imageCount ? "image" : "video", activeType = typeParam === "video" || typeParam === "image" ? typeParam : defaultType;
  const filteredItems = useMemo(() => {
    if (!activeGroup) return [];
    if (activeType === "video") return activeGroup.items.filter((item) => item.resourceType === "video");
    return activeGroup.items.filter((item) => item.resourceType !== "video");
  }, [activeGroup, activeType]);
  const activeIndex = filteredItems.findIndex((item) => item._id === mediaParam);
  const assignedEmails = useMemo(() => {
    if (!activeGroup) return [];
    const set = new Set<string>();
    activeGroup.items.forEach((item) => {
      (item.allowedUsers || []).forEach((client) => {
        if (typeof client === "string") return;
        if (client?.email) set.add(client.email);
      });
    });
    return Array.from(set).sort();
  }, [activeGroup]);

  const fetchMedia = async () => {
    const data = await apiFetchAdmin("/api/media");
    const items = data.items || [];
    setMedia(items);
    return items as MediaItem[];
  };
  const loadMedia = async () => {
    setLoading(true);
    setError(null);
    try {
      await fetchMedia();
    } catch (err) {
      setError((err as Error).message || "Failed to load galleries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    if (user?.role === "admin") loadMedia();
    else setLoading(false);
  }, [hydrated, user]);
  useEffect(() => {
    if (!activeGroup) return;
    setEditTitle(activeGroup.title);
    setEditDescription(activeGroup.description || "");
    const cover = pickCover(activeGroup.items);
    setCoverId(cover?._id || null);
  }, [activeGroup?.id]);

  const pushState = (galleryId?: string, type?: string, mediaId?: string) => {
    if (!galleryId) {
      router.push("/admin/gallery");
      return;
    }
    const params = new URLSearchParams();
    params.set("gallery", galleryId);
    if (type) params.set("type", type);
    if (mediaId) params.set("mediaId", mediaId);
    router.push(`/admin/gallery?${params.toString()}`);
  };
  const openGallery = (groupId: string, type: "image" | "video") => pushState(groupId, type);
  const openMedia = (mediaId: string) => activeGroup && pushState(activeGroup.id, activeType, mediaId);
  const closeLightbox = () => activeGroup && pushState(activeGroup.id, activeType);
  const goPrev = () => {
    if (!activeGroup || filteredItems.length === 0) return;
    const index = activeIndex > 0 ? activeIndex - 1 : filteredItems.length - 1;
    pushState(activeGroup.id, activeType, filteredItems[index]._id);
  };
  const goNext = () => {
    if (!activeGroup || filteredItems.length === 0) return;
    const index = activeIndex < filteredItems.length - 1 ? activeIndex + 1 : 0;
    pushState(activeGroup.id, activeType, filteredItems[index]._id);
  };

  const handleSaveGallery = async () => {
    if (!activeGroup) return;
    const nextTitle = editTitle.trim() || activeGroup.title;
    setSaving(true);
    setActionMessage(null);
    try {
      await apiFetchAdmin("/api/media/bulk", { method: "PATCH", body: JSON.stringify({ ids: activeGroup.items.map((item) => item._id), title: nextTitle, description: editDescription }) });
      await fetchMedia();
      const newId = buildGroupId(nextTitle, activeGroup.items[0]._id);
      pushState(newId, activeType);
      setActionMessage("Gallery updated.");
    } catch (err) {
      setActionMessage((err as Error).message || "Failed to update gallery.");
    } finally {
      setSaving(false);
    }
  };

  const handleUploadFiles = async (files: File[]) => {
    if (!activeGroup) return;
    const nextTitle = editTitle.trim() || activeGroup.title;
    setUploading(true);
    setActionMessage(null);
    try {
      const form = new FormData();
      files.forEach((file) => form.append("files", file));
      form.append("title", nextTitle);
      form.append("description", editDescription);
      await apiFetchAdmin("/api/media/upload", { method: "POST", body: form });
      await fetchMedia();
      const newId = buildGroupId(nextTitle, activeGroup.items[0]._id);
      pushState(newId, activeType);
      setActionMessage(`Uploaded ${files.length} file(s).`);
    } catch (err) {
      setActionMessage((err as Error).message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleAssignEmails = async () => {
    if (!activeGroup) return;
    const emails = assignEmails.split(",").map((email) => email.trim()).filter(Boolean);
    if (emails.length !== 1) {
      setActionMessage("Only one email at a time.");
      return;
    }
    if (emails.length === 0) {
      setActionMessage("Enter at least one email.");
      return;
    }
    const nextTitle = editTitle.trim() || activeGroup.title;
    setAssigning(true);
    setActionMessage(null);
    try {
      await apiFetchAdmin("/api/media/bulk-allow", { method: "POST", body: JSON.stringify({ ids: activeGroup.items.map((item) => item._id), emails, title: nextTitle }) });
      await fetchMedia();
      setAssignEmails("");
      setActionMessage("Access assigned.");
    } catch (err) {
      setActionMessage((err as Error).message || "Assign failed.");
    } finally {
      setAssigning(false);
    }
  };

  const handleRemoveEmail = async (email: string) => {
    if (!activeGroup) return;
    setRemovingEmail(email);
    setActionMessage(null);
    try {
      await apiFetchAdmin("/api/media/bulk-remove", { method: "POST", body: JSON.stringify({ ids: activeGroup.items.map((item) => item._id), emails: [email] }) });
      await fetchMedia();
      setActionMessage("Access removed.");
    } catch (err) {
      setActionMessage((err as Error).message || "Remove failed.");
    } finally {
      setRemovingEmail(null);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!activeGroup) return;
    setDeletingId(id);
    setActionMessage(null);
    try {
      await apiFetchAdmin(`/api/media/${id}`, { method: "DELETE" });
      const items = await fetchMedia();
      const nextGroups = groupMedia(items);
      const stillExists = nextGroups.find((group) => group.id === activeGroup.id);
      if (!stillExists) pushState();
      setActionMessage("Item deleted.");
    } catch (err) {
      setActionMessage((err as Error).message || "Delete failed.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteMany = async (ids: string[]) => {
    if (!activeGroup || ids.length === 0) return;
    setActionMessage(null);
    try {
      await apiFetchAdmin("/api/media/bulk-delete", { method: "POST", body: JSON.stringify({ ids }) });
      const items = await fetchMedia();
      const nextGroups = groupMedia(items);
      const stillExists = nextGroups.find((group) => group.id === activeGroup.id);
      if (!stillExists) pushState();
      setActionMessage("Items deleted.");
    } catch (err) {
      setActionMessage((err as Error).message || "Bulk delete failed.");
    }
  };

  const handleDeleteGallery = async () => {
    if (!activeGroup) return;
    await handleDeleteMany(activeGroup.items.map((item) => item._id));
  };

  const handleSetCover = async (id: string) => {
    if (!activeGroup) return;
    setActionMessage(null);
    try {
      await apiFetchAdmin("/api/media/set-cover", { method: "POST", body: JSON.stringify({ ids: activeGroup.items.map((item) => item._id), coverId: id }) });
      await fetchMedia();
      setCoverId(id);
      setActionMessage("Cover updated.");
    } catch (err) {
      setActionMessage((err as Error).message || "Cover update failed.");
    }
  };

  if (!hydrated) return <div className="page-wrap flex-1"><div className="bg-aurora" /><div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-12"><div className="glass p-6 text-sm text-[var(--muted)]">Loading admin...</div></div></div>;

  if (!user) return <div className="page-wrap flex-1"><div className="bg-aurora" /><div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-12"><div className="glass p-6 text-sm text-[var(--muted)]">Please login as admin.</div><button onClick={() => { clearAdminAuth(); router.push("/admin/login"); }} className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/90">Go to admin login</button></div></div>;

  if (user.role !== "admin") {
    return (
      <div className="page-wrap flex-1">
        <div className="bg-aurora" />
        <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-12">
          <div className="glass p-6 text-sm text-red-300">This area is for admins only.</div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => { clearAdminAuth(); router.push("/admin/login"); }} className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/90">Login as admin</button>
            <button onClick={() => { clearAdminAuth(); router.push("/login"); }} className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/90">Login as client</button>
          </div>
        </div>
      </div>
    );
  }

  if (!activeGroup) {
    return (
      <AdminShell title="Gallery management" subtitle="Open a gallery to view images or videos.">
        {loading ? <div className="glass p-6 text-sm text-[var(--muted)]">Loading media...</div> : null}
        {error ? <div className="glass p-6 text-sm text-red-300">{error}</div> : null}
        {!loading && !error ? <GalleryList groups={groups} onOpen={openGallery} /> : null}
      </AdminShell>
    );
  }

  return (
    <div className="page-wrap flex-1">
      <div className="bg-aurora" />
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 sm:px-10">
        {loading ? <div className="glass p-6 text-sm text-[var(--muted)]">Loading media...</div> : null}
        {error ? <div className="glass p-6 text-sm text-red-300">{error}</div> : null}
        {!loading && !error ? (
          <GalleryGrid
            group={activeGroup as GalleryGroup}
            activeType={activeType}
            items={filteredItems}
            loading={loading}
            editTitle={editTitle}
            editDescription={editDescription}
            saving={saving}
            uploading={uploading}
            assigning={assigning}
            deletingId={deletingId}
            actionMessage={actionMessage}
            assignEmails={assignEmails}
            assignedEmails={assignedEmails}
            removingEmail={removingEmail}
            coverId={coverId}
            onOpenMedia={openMedia}
            onBack={() => pushState()}
            onSwitchType={(type) => pushState(activeGroup.id, type)}
            onChangeTitle={setEditTitle}
            onChangeDescription={setEditDescription}
            onChangeAssignEmails={setAssignEmails}
            onSaveGallery={handleSaveGallery}
            onUploadFiles={handleUploadFiles}
            onAssignEmails={handleAssignEmails}
            onRemoveEmail={handleRemoveEmail}
            onDeleteItem={handleDeleteItem}
            onDeleteMany={handleDeleteMany}
            onDeleteGallery={handleDeleteGallery}
            onSetCover={handleSetCover}
          />
        ) : null}
      </div>
      {activeIndex >= 0 ? (
        <Lightbox items={filteredItems} activeIndex={activeIndex} onClose={closeLightbox} onPrev={goPrev} onNext={goNext} />
      ) : null}
    </div>
  );
}



