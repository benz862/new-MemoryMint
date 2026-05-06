/**
 * Supabase Storage bucket ids (must match Dashboard / migrations).
 *
 * Private buckets: the app uses the service role for uploads and signed URLs
 * for reads, so the Storage API often shows "0 policies" until you add
 * client-side upload rules.
 */
export const STORAGE_BUCKETS = {
  memorialImages: "memorial-images",
  memorialVideos: "memorial-videos",
  memorialAudio: "memorial-audio",
  memorialDocuments: "memorial-documents",
  qrAssets: "qr-assets",
  /** Optional public bucket (your project); wire in when you use it. */
  userPhotos: "user-photos",
} as const;

export type StorageBucketId =
  (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];
