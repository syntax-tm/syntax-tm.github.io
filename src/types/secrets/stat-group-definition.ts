import { StatGroupType } from "@enums";
import { StatDefinition } from "./stat-definition";

export interface StatGroupDefinition {
  type: StatGroupType;
  title: string;
  isHidden: boolean;
  items?: StatDefinition[];
}
