import { Setting } from "./setting";
import { StatDefinition } from "./stat-definition";

export const getDefaultSettings = (stats: StatDefinition[]): Setting[] => {
  const defaults: Setting[] = [];

  stats.forEach((stat) => {
    const setting: Setting = {
      id: stat.id,
      isEnabled: stat.isEnabled ?? false,
      isUnlocked: !(stat.isLocked ?? true),
      stat: stat,
      type: stat.type,
    };

    defaults.push(setting);
  });

  return defaults;
};