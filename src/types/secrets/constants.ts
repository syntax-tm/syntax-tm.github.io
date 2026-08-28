'use client';

import { TrophyDefinition } from "./trophy-definition";
import { getDefaultSettings } from "./util";
import { AchievementId } from "@enums";
import settingDefinitions from "@config/settings";
import settingGroupDefinitions from "@config/settingGroups";
import trophyDefinitions from "@config/trophies";

export const stats = settingDefinitions;
export const secrets = stats;
export const secretGroups = settingGroupDefinitions;
export const trophies = trophyDefinitions as TrophyDefinition[];

export const defaultSettings = getDefaultSettings(stats);

export const achievements = new Set<AchievementId>(
  [
    "ANDROID",
    "DREAMCAST",
    "IWHBYD",
    "KONAMI_CODE",
    "MISSING_NO",
    "OCEANGATE",
    "PSP",
    "PS2",
    "_404",
    "BRIX",
    "WII",
  ],
);
