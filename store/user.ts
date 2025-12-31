import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ProfileData = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string | null;
  avatar?: string | null;
};

export type ExperienceLevel = 'LESS_THAN_1_YEAR' | 'ONE_TO_THREE_YEARS' | 'THREE_TO_FIVE_YEARS' | 'FIVE_TO_TEN_YEARS' | 'MORE_THAN_TEN_YEARS';

export type ExpertData = {
  domains: string;
  subdomains: string[];
  skills: string[];
  sampleJob?: string[];
  contactLinks?: string[];
  contactNumbers?: string[];
  province?: string;
  city?: string;
  location?: string;
  yearsOfExperience?: ExperienceLevel;
  pricePerSession?: number;
  pricingModel?: 'per_session' | 'per_hour';
  availability: string;
  description: string;
  documents: string[];
};

type UIState = {
  activeTab: 'general' | 'expert';
  isProfileSaving: boolean;
  isExpertSaving: boolean;
};

type UserStore = {
  profile: ProfileData | null;
  expert: ExpertData | null;
} & UIState & {
    setActiveTab: (tab: UIState['activeTab']) => void;
    setProfile: (profile: ProfileData | null) => void;
    setExpert: (expert: ExpertData | null) => void;
  };

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      activeTab: 'general',
      isProfileSaving: false,
      isExpertSaving: false,
      profile: null,
      expert: null,
      setActiveTab: (tab) => set({ activeTab: tab }),
      setProfile: (profile) => set({ profile }),
      setExpert: (expert) => set({ expert }),
    }),
    {
      name: 'user-profile-store',
      partialize: (state) => ({
        profile: state.profile,
        expert: state.expert,
        activeTab: state.activeTab,
      }),
    },
  ),
);
