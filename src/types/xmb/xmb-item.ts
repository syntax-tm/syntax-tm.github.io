import { ReactElement } from "react";
import { IXmbItem, ICategory } from "./interfaces";

export class XmbItem implements IXmbItem {
  private _category: ICategory | null = null;
  private _description: string | null = '';
  id: string;
  title: string;
  link?: string | null = '';
  type: string = '';
  icon: ReactElement | null;
  isEnabled: boolean = true;
  isHidden: boolean = false;

  constructor(id: string, title: string = '', icon: ReactElement | null = null, link?: string | null, description?: string | null, isEnabled?: boolean, isHidden?: boolean, category: ICategory | null = null) {
    this.id = id;
    this.title = title;
    this.icon = icon;
    this.link = link;
    this._description = description ?? null;
    this._category = category;
    this.isEnabled = isEnabled ?? true;
    this.isHidden = isHidden ?? false;
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
