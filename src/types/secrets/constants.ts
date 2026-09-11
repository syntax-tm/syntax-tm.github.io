import { TrophyDefinition } from "./trophy-definition";
import { getDefaultSettings } from "./util";
import { AchievementId } from "@enums";
import { stats, secretMap } from "@config/settings";
import settingGroupDefinitions from "@config/setting-groups";
import trophyDefinitions from "@config/trophies";

export const secrets = stats;
export const secretGroups = settingGroupDefinitions;
export const trophies = trophyDefinitions as TrophyDefinition[];

export const defaultSettings = getDefaultSettings(stats);

export const achievements = Object.keys(secretMap).map(k => k as AchievementId);
