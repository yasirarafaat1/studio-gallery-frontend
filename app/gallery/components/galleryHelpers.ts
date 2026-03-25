export type MediaItem = {
  _id: string;
  title?: string;
  description?: string;
  secureUrl: string;
  resourceType?: string;
  isCover?: boolean;
  createdAt?: string;
};

export type GalleryGroup = {
  id: string;
  title: string;
  description?: string;
  items: MediaItem[];
  imageCount: number;
  videoCount: number;
  coverUrl: string;
  coverType: "image" | "video";
};

const slugify = (value: string) => {
  const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return slug || "gallery";
};

export const buildGroupId = (title: string, sampleId: string) => `${slugify(title)}-${sampleId.slice(-6)}`;

export const pickCover = (items: MediaItem[]) => {
  return items.find((item) => item.isCover) || items.find((item) => item.resourceType !== "video") || items[0];
};

export const groupMedia = (items: MediaItem[]) => {
  const map = new Map<string, GalleryGroup>();
  items.forEach((item) => {
    const baseTitle = (item.title || "Untitled gallery").trim();
    const key = baseTitle.toLowerCase();
    if (!map.has(key)) {
      const id = buildGroupId(baseTitle, item._id);
      map.set(key, {
        id,
        title: baseTitle,
        description: item.description,
        items: [],
        imageCount: 0,
        videoCount: 0,
        coverUrl: item.secureUrl,
        coverType: item.resourceType === "video" ? "video" as const : "image" as const,
      });
    }
    const group = map.get(key);
    if (!group) return;
    group.items.push(item);
    if (item.resourceType === "video") group.videoCount += 1;
    else group.imageCount += 1;
  });

  return Array.from(map.values()).map((group) => {
    const cover = pickCover(group.items);
    return {
      ...group,
      coverUrl: cover?.secureUrl || group.coverUrl,
      coverType: cover?.resourceType === "video" ? "video" as const : "image" as const,
    };
  });
};

