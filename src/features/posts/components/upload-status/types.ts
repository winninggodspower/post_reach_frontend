export type PlatformMeta = {
  label: string;
  icon: string;
}

export type DisplayPlatform = {
  id: string | number;
  platform: string;
  status: "pending" | "uploading" | "processing" | "posted" | "failed" | "scheduled";
  url: string | null;
  meta: PlatformMeta;
}

export type PreviewData = {
  title: string;
  caption: string;
  imageSrc?: string;
  videoSrc?: string;
}
