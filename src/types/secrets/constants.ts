import { StatDefinition } from "./stat-definition";
import { StatGroupDefinition } from "./stat-group-definition";
import { StatGroupMap } from "./stat-group-map";
import settingDefinitions from "@config/settings.json";
import settingGroupDefinitions from "@config/settingGroups.json";
import { StatGroupType } from "@enums";

export const statDefs = settingDefinitions as StatDefinition[];
export const groupDefs = settingGroupDefinitions as StatGroupDefinition[];

export const allSecrets: StatDefinition[] = Object.values(statDefs);

const secretGroups = new StatGroupMap();

groupDefs.forEach((groupDef) => {
  const type: StatGroupType = groupDef.type;
  const items = statDefs.filter(s => s.type === type);
  const group: StatGroupDefinition = {
    type,
    title: groupDef.title,
    items,
  };
  secretGroups.set(groupDef.type, group);
});

export { secretGroups, statDefs as secrets };