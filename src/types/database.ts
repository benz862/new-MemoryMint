export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type HostingPlan = "tribute" | "legacy" | "heritage";

export type MemorialStatus = "draft" | "published" | "archived";

export type MemorialStyle =
  | "classic_elegant"
  | "warm_family"
  | "celebration_of_life"
  | "faith_prayer"
  | "modern_minimal"
  | "floral_remembrance"
  | "veteran_tribute";

export type SubmissionKind = "message" | "photo" | "video" | "voice";

export type SubmissionStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "family_only";

export type MemorialRow = {
  id: string;
  slug: string;
  status: MemorialStatus;
  full_name: string;
  birth_date: string;
  passing_date: string;
  funeral_date: string | null;
  funeral_location: string | null;
  family_contact_email: string;
  style: MemorialStyle;
  main_photo_path: string | null;
  obituary: string;
  ai_content: Json;
  hosting_plan: HostingPlan;
  hosting_expires_at: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_checkout_session_id: string | null;
  accepts_guest_submissions: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

export type SubmissionRow = {
  id: string;
  memorial_id: string;
  kind: SubmissionKind;
  status: SubmissionStatus;
  guest_display_name: string | null;
  body: string | null;
  storage_object_key: string | null;
  storage_bucket: string | null;
  client_offline_id: string | null;
  metadata: Json;
  created_at: string;
  moderated_at: string | null;
  moderated_by: string | null;
};

export interface Database {
  public: {
    Tables: {
      memorials: {
        Row: MemorialRow;
        Insert: {
          id?: string;
          slug: string;
          status?: MemorialStatus;
          full_name: string;
          birth_date: string;
          passing_date: string;
          funeral_date?: string | null;
          funeral_location?: string | null;
          family_contact_email: string;
          style: MemorialStyle;
          main_photo_path?: string | null;
          obituary: string;
          ai_content?: Json;
          hosting_plan: HostingPlan;
          hosting_expires_at?: string | null;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          stripe_checkout_session_id?: string | null;
          accepts_guest_submissions?: boolean;
          created_by?: string | null;
          published_at?: string | null;
        };
        Update: Partial<Omit<MemorialRow, "created_at" | "updated_at">>;
        Relationships: [];
      };
      submissions: {
        Row: SubmissionRow;
        Insert: {
          id?: string;
          memorial_id: string;
          kind: SubmissionKind;
          status?: SubmissionStatus;
          guest_display_name?: string | null;
          body?: string | null;
          storage_object_key?: string | null;
          storage_bucket?: string | null;
          client_offline_id?: string | null;
          metadata?: Json;
        };
        Update: Partial<
          Omit<SubmissionRow, "created_at"> & { id?: string }
        >;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
