import StatThemeAudioConfig from "./stat-theme-audio-config";
import { StatThemeBootConfig } from "./stat-theme-boot-config";

export interface StatThemeConfig {
  audio?: StatThemeAudioConfig;
  background?: string;
  boot?: StatThemeBootConfig | string;
  clock?: string;
  font?: string;
}
