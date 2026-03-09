import { create } from 'zustand';
import { supabase } from '@/lib/supabase/supabase';
import { UserProfile } from '@/types';

type UserProfileState = {
  profile: UserProfile | null;
  isLoadingProfile: boolean;
};

type UserProfileActions = {
  fetchUserProfile: () => Promise<void>;
  clearUserProfile: () => void;
};

export const useUserProfileStore = create<UserProfileState & UserProfileActions>((set) => ({
  profile: null,
  isLoadingProfile: false,

  fetchUserProfile: async () => {
    set({ isLoadingProfile: true });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        set({ profile: null, isLoadingProfile: false });
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) {
        throw error;
      }

      set({ profile: data, isLoadingProfile: false });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      set({ profile: null, isLoadingProfile: false });
    }
  },

  clearUserProfile: () => set({ profile: null }),
}));
