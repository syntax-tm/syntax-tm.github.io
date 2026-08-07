import { StatDefinition } from "./stat-definition";
import settingDefinitions from "@config/settings.json";
import settingGroupDefinitions from "@config/settingGroups.json";
import { getDefaultSettings } from "./util";
import { StatGroupDefinition } from "./stat-group-definition";

export const secrets = settingDefinitions as StatDefinition[];
export const secretGroups = settingGroupDefinitions as StatGroupDefinition[];

export const defaultSettings = getDefaultSettings(secrets);
