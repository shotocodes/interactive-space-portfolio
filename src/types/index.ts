// types/index.ts

export interface PlanetData {
  name: string;
  description: string;
  color: number;
  size: number;
  link: string;
}

export interface ActionPlanetData {
  name: string;
  description: string;
  color: number;
  size: number;
  action: string;
  links?: LinkData[];
}

export interface LinkData {
  name: string;
  url: string;
}

export interface Config {
  orbitSpeed: number;
  orbitRadius: number;
  actionOrbitRadius: number;
  sunSize: number;
  sunParticleCount: number;
  planetCount: number;
  actionPlanetCount: number;
}

export type Language = 'ja' | 'en';

export interface LanguageUIData {
  settings: string;
  language: string;
  close: string;
  viewDetails: string;
  orbitSpeed: string;
  orbitSize: string;
  sunSize: string;
  sunParticles: string;
  selectPlanet: string;
  hoverInstruction: string;
}

export interface LanguagePlanetData {
  name: string;
  description: string;
}

export interface LanguageActionData {
  name: string;
  description: string;
}

export interface LanguageContent {
  mainTitle: string;
  mainSubtitle: string;
  planets: {
    about: LanguagePlanetData;
    projects: LanguagePlanetData;
    services: LanguagePlanetData;
    contact: LanguagePlanetData;
  };
  actions: {
    controls: LanguageActionData;
    sns: LanguageActionData;
    blog: LanguageActionData;
  };
  ui: LanguageUIData;
}

export interface LanguageData {
  ja: LanguageContent;
  en: LanguageContent;
}

export interface PlanetInfoData {
  name: string;
  description: string;
  link?: string;
  isActionPlanet?: boolean;
  action?: string;
  links?: LinkData[];
}
