import { AchievementId, SecretGroupType } from "@enums";
import { StatThemeConfig } from "./stat-theme-config";

export interface StatDefinition {
  id: AchievementId;
  title: string;
  description?: string;
  type: SecretGroupType;
  isLocked?: boolean;
  isEnabled?: boolean;
  trophy: number;
  theme?: StatThemeConfig;
  // TODO: add a hint indicating how this can be unlocked
}

export { StatDefinition as default };
