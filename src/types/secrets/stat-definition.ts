import { AchievementId, SecretGroupType } from "@enums";

export interface StatDefinition {
  id: AchievementId;
  title: string;
  description?: string;
  type: SecretGroupType;
  isLocked?: boolean;
  isEnabled?: boolean;
  // TODO: add a hint indicating how this can be unlocked
}

export default StatDefinition;
