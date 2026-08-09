import { AchievementId, SecretGroupType } from "@enums";
import { StatThemeConfig } from "./stat-theme-config";

export interface StatDefinition {
  id: AchievementId;
  title: string;
  description?: string;
  type: SecretGroupType;
  isLocked?: boolean;
  isEnabled?: boolean;
  theme?: StatThemeConfig;
  // TODO: add a hint indicating how this can be unlocked
}

export default StatDefinition;
