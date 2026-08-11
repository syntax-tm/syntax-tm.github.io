import { StatDefinition } from "./stat-definition";
import settingDefinitions from "@config/settings.json";
import settingGroupDefinitions from "@config/settingGroups.json";
import { getDefaultSettings } from "./util";
import { StatGroupDefinition } from "./stat-group-definition";
import { AchievementId } from "@enums";

export const secrets = settingDefinitions as StatDefinition[];
export const secretGroups = settingGroupDefinitions as StatGroupDefinition[];

export const defaultSettings = getDefaultSettings(secrets);

export const achievements = new Set<AchievementId>(
  [
    "ANDROID",
    "DREAMCAST",
    "IWHBYD",
    "IWHBYD",
    "KONAMI_CODE",
    "MISSING_NO",
    "OCEANGATE",
    "PSP_CODE",
    "_404",
  ],
);
