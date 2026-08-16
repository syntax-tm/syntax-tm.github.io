import { AchievementId, SecretGroupType } from "@enums";
import { StatDefinition } from "./stat-definition";

export class Setting {
  id: AchievementId;
  stat: StatDefinition;
  isUnlocked: boolean;
  isEnabled: boolean;
  type: SecretGroupType;

  constructor(stat: StatDefinition) {
    this.stat = stat;
    this.id = stat.id;
    this.type = stat.type;
    this.isUnlocked = !stat.isLocked;
    this.isEnabled = stat.isEnabled ?? false;
  }
}
