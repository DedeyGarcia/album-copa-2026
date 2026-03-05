import { Database } from "@/lib/supabase/types/supabase-extracted-types";

export type Sticker = Database['public']['Tables']['stickers']['Row'];
export type UserSticker = Database['public']['Tables']['user_stickers']['Row'];
export type UserProfile = Database['public']['Tables']['profiles']['Row'];