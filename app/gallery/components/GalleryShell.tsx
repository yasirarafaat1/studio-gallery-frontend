"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "../../lib/api";
import { clearAuth, getUser } from "../../lib/auth";
import GalleryGrid from "./GalleryGrid";
import GalleryList from "./GalleryList";
import Lightbox from "./Lightbox";
import { groupMedia } from "./galleryHelpers";
import type { GalleryGroup, MediaItem } from "./galleryHelpers";

export default function GalleryShell() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const focusId = searchParams.get("mediaId");
  const galleryParam = searchParams.get("gallery");
  const typeParam = searchParams.get("type");
  const [items, setItems] = useState<MediaItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [busyFavoriteId, setBusyFavoriteId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const user = useMemo(() => getUser(), []);
  const groups = useMemo(() => groupMedia(items), [items]);
  const activeGroup = groups.find((group) => group.id === galleryParam);
  const defaultType = activeGroup?.imageCount ? "image" : "video";
  const activeType = typeParam === "video" || typeParam === "image" ? typeParam : defaultType;
  const filteredItems = useMemo(() => {
    if (!activeGroup) return [];
    if (activeType === "video") return activeGroup.items.filter((item) => item.resourceType === "video");
    return activeGroup.items.filter((item) => item.resourceType !== "video");
  }, [activeGroup, activeType]);
  const activeIndex = filteredItems.findIndex((item) => item._id === focusId);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [mediaData, meData] = await Promise.all([apiFetch("/api/media"), apiFetch("/api/auth/me")]);
        setItems(mediaData.items || []);
        const favs = (meData.user?.favorites || []).map((id: string) => id.toString());
        setFavorites(favs);
      } catch (err) {
        setError((err as Error).message || "Failed to load galleries");
      } finally {
        setLoading(false);
      }
    };

    if (hydrated && user) load();
    else setLoading(false);
  }, [hydrated, user]);

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  const pushState = (galleryId?: string, type?: string, mediaId?: string) => {
    if (!galleryId) {
      router.push("/gallery");
      return;
    }
    const params = new URLSearchParams();
    params.set("gallery", galleryId);
    if (type) params.set("type", type);
    if (mediaId) params.set("mediaId", mediaId);
    router.push(`/gallery?${params.toString()}`);
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

  const handleToggleFavorite = async (id: string) => {
    if (busyFavoriteId) return;
    const isFavorite = favorites.includes(id);
    setBusyFavoriteId(id);
    setActionMessage(null);
    setFavorites((prev) => (isFavorite ? prev.filter((fav) => fav !== id) : [...prev, id]));
    try {
      await apiFetch("/api/media/favorite", {
        method: "POST",
        body: JSON.stringify({ id, favorite: !isFavorite }),
      });
      setActionMessage(isFavorite ? "Removed from favorites." : "Added to favorites.");
    } catch (err) {
      setFavorites((prev) => (isFavorite ? [...prev, id] : prev.filter((fav) => fav !== id)));
      setActionMessage((err as Error).message || "Failed to update favorite.");
    } finally {
      setBusyFavoriteId(null);
    }
  };

  if (!hydrated) {
    return (
      <div className="page-wrap flex-1">
        <div className="bg-aurora" />
        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-12">
          <div className="glass p-6 text-sm text-[var(--muted)]">Loading gallery...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page-wrap flex-1">
        <div className="bg-aurora" />
        <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-12">
          <div className="glass p-6 text-sm text-[var(--muted)]">Please login to view your gallery.</div>
          <Link href="/login" className="text-sm text-white/70 hover:text-white">Go to client login</Link>
        </div>
      </div>
    );
  }

  if (user.role !== "client") {
    return (
      <div className="page-wrap flex-1">
        <div className="bg-aurora" />
        <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-12">
          <div className="glass p-6 text-sm text-[var(--muted)]">This page is for clients only.</div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/dashboard" className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/90">
              Go to admin dashboard
            </Link>
            <button
              onClick={() => {
                clearAuth();
                router.push("/login");
              }}
              className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/90"
            >
              Login as client
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrap flex-1">
      <div className="bg-aurora" />
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 sm:px-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Client gallery</p>
            <h1 className="section-title text-3xl">Welcome {user?.email || "back"}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-white/70 hover:text-white">Home</Link>
            <button
              onClick={handleLogout}
              className="rounded-full border border-white/20 cursor-pointer px-4 py-2 text-sm text-white/90 bg-red-500 transition hover:border-white/50"
            >
              Logout
            </button>
          </div>
        </header>

        {loading ? <div className="glass p-6 text-sm text-[var(--muted)]">Loading galleries...</div> : null}
        {error ? (
          <div className="glass p-6 text-sm text-red-300">
            {error.includes("403")
              ? "Access pending approval. Please wait for your studio to grant access."
              : error}
          </div>
        ) : null}

        {!loading && !error && !activeGroup ? <GalleryList groups={groups} onOpen={openGallery} /> : null}

        {!loading && !error && activeGroup ? (
          <GalleryGrid
            group={activeGroup as GalleryGroup}
            activeType={activeType}
            items={filteredItems}
            favorites={favorites}
            loading={loading}
            busyFavoriteId={busyFavoriteId}
            actionMessage={actionMessage}
            onOpenMedia={openMedia}
            onBack={() => pushState()}
            onSwitchType={(type) => pushState(activeGroup.id, type)}
            onToggleFavorite={handleToggleFavorite}
          />
        ) : null}
      </div>
      {activeIndex >= 0 ? (
        <Lightbox items={filteredItems} activeIndex={activeIndex} onClose={closeLightbox} onPrev={goPrev} onNext={goNext} />
      ) : null}
    </div>
  );
}


