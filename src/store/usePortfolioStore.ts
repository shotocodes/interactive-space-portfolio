// store/usePortfolioStore.ts
import { create } from 'zustand';
import { Language, Config, PlanetInfoData } from '@/types';
import { defaultConfig } from '@/lib/data/planetData';

interface PortfolioStore {
  language: Language;
  config: Config;
  showControls: boolean;
  showPlanetInfo: boolean;
  planetInfoData: PlanetInfoData | null;
  hoveredPlanet: any;
  showAboutModal: boolean;
  showProjectModal: boolean;
  showServiceModal: boolean;
  showContactModal: boolean;
  isTransitioning: boolean;

  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  updateConfig: (key: keyof Config, value: number) => void;
  setShowControls: (show: boolean) => void;
  toggleControls: () => void;
  setShowPlanetInfo: (show: boolean) => void;
  setPlanetInfoData: (data: PlanetInfoData | null) => void;
  setHoveredPlanet: (planet: any) => void;
  setShowAboutModal: (show: boolean) => void;
  toggleAboutModal: () => void;
  setShowProjectModal: (show: boolean) => void;
  toggleProjectModal: () => void;
  setShowServiceModal: (show: boolean) => void;
  toggleServiceModal: () => void;
  setShowContactModal: (show: boolean) => void;
  toggleContactModal: () => void;
  setIsTransitioning: (transitioning: boolean) => void;
}

export const usePortfolioStore = create<PortfolioStore>((set, get) => ({
  language: 'ja',
  config: defaultConfig,
  showControls: false,
  showPlanetInfo: false,
  planetInfoData: null,
  hoveredPlanet: null,
  showAboutModal: false,
  showProjectModal: false,
  showServiceModal: false,
  showContactModal: false,
  isTransitioning: false,

  setLanguage: (lang) => {
    console.log('Store: setLanguage', lang);
    set({ language: lang });
  },

  toggleLanguage: () => {
    const currentLang = get().language;
    const newLang = currentLang === 'ja' ? 'en' : 'ja';
    console.log('Store: toggleLanguage', currentLang, '->', newLang);
    set({ language: newLang });
  },

  updateConfig: (key, value) => {
    console.log('Store: updateConfig called', key, value);
    const currentConfig = get().config;
    const newConfig = { ...currentConfig, [key]: value };
    console.log('Store: new config', newConfig);
    set({ config: newConfig });
  },

  setShowControls: (show) => set({ showControls: show }),

  toggleControls: () => set((state) => ({
    showControls: !state.showControls
  })),

  setShowPlanetInfo: (show) => set({ showPlanetInfo: show }),

  setPlanetInfoData: (data) => set({
    planetInfoData: data,
    showPlanetInfo: data !== null
  }),

  setHoveredPlanet: (planet) => set({ hoveredPlanet: planet }),

  setShowAboutModal: (show) => set({ showAboutModal: show }),

  toggleAboutModal: () => set((state) => ({
    showAboutModal: !state.showAboutModal
  })),

  setShowProjectModal: (show) => set({ showProjectModal: show }),

  toggleProjectModal: () => set((state) => ({
    showProjectModal: !state.showProjectModal
  })),

  setShowServiceModal: (show) => set({ showServiceModal: show }),

  toggleServiceModal: () => set((state) => ({
    showServiceModal: !state.showServiceModal
  })),

  setShowContactModal: (show) => set({ showContactModal: show }),

  toggleContactModal: () => set((state) => ({
    showContactModal: !state.showContactModal
  })),

  setIsTransitioning: (transitioning) => set({ isTransitioning: transitioning }),
}));
