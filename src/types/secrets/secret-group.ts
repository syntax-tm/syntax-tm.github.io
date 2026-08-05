import { SecretGroupType } from "@enums";
import { StatDefinition } from "./stat-definition";

export class SecretGroup {
  type: SecretGroupType;
  title: string;
  isRadio = true;
  items: StatDefinition[];

  constructor(type: SecretGroupType, title: string, items: StatDefinition[] = []) {
    this.type = type;
    this.title = title;
    this.items = items;
  }
}
