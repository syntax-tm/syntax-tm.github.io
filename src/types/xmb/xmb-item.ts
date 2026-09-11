import { IXmbItem, ICategory } from "./interfaces";
import { MenuItemType } from "@enums";
import { IconBase } from "./xmb-icon";

export class XmbItem implements IXmbItem {
  private _category: ICategory | null = null;
  private _description: string | null = '';
  type: MenuItemType;
  title: string;
  link?: string | null = '';
  icon: IconBase;
  isEnabled: boolean = true;
  isHidden: boolean = false;
  index: number;

  constructor(type: MenuItemType, title: string, icon: IconBase, link?: string | null, description?: string | null, isEnabled?: boolean, isHidden?: boolean, index?: number, category: ICategory | null = null) {
    this.type = type;
    this.title = title;
    this.icon = icon;
    this.link = link;
    this._description = description ?? null;
    this._category = category;
    this.isEnabled = isEnabled ?? true;
    this.isHidden = isHidden ?? false;
    this.index = index ?? -1;
  }

  get category(): ICategory | null {
    return this._category;
  }

  set category(value: ICategory) {
    this._category = value;
  }

  get description(): string | null {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }
}

export { XmbItem as default };
