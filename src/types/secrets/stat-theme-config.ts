import { StatThemeBootConfig } from "./stat-theme-boot-config";

export interface StatThemeConfig {
  background?: string;
  boot?: StatThemeBootConfig | string;
  clock?: string;
  font?: string;
}
