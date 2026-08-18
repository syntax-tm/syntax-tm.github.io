import { AchievementId, SecretGroupType } from "@enums";
import { StatThemeConfig } from "./stat-theme-config";
import { IXmbMenu } from "types/xmb";

export interface StatDefinition {
  id: AchievementId;
  title: string;
  description?: string;
  type: SecretGroupType;
  isLocked?: boolean;
  isEnabled?: boolean;
  trophy: number;
  theme?: StatThemeConfig;
  menu?: IXmbMenu;
  password?: string;
  // TODO: add a hint indicating how this can be unlocked
}

export { type StatDefinition as default };
