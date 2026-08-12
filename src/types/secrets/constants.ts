import { StatDefinition } from "./stat-definition";
import { StatGroupDefinition } from "./stat-group-definition";
import { TrophyDefinition } from "./trophy-definition";
import { getDefaultSettings } from "./util";
import { AchievementId } from "@enums";
import settingDefinitions from "@config/settings";
import settingGroupDefinitions from "@config/settingGroups";
import trophyDefinitions from "@config/trophies";

export const secrets = settingDefinitions as StatDefinition[];
export const secretGroups = settingGroupDefinitions as StatGroupDefinition[];
export const trophies = trophyDefinitions as TrophyDefinition[];

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
    "PS2",
    "_404",
  ],
);
