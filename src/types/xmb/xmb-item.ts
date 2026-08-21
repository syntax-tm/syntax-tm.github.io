import { ReactElement } from "react";
import { IXmbItem, IMenuItem } from "./interfaces";

export class XmbItem implements IXmbItem, IMenuItem {
  id: string;
  title: string;
  link?: string | null = '';
  type: string = '';
  icon: ReactElement | null;
  description?: string | null = '';
  category?: string = '';
  isEnabled: boolean = true;

  constructor(id: string, title: string = '', icon: ReactElement | null = null, link?: string | null, description?: string | null, isEnabled?: boolean) {
    this.id = id;
    this.title = title;
    this.icon = icon;
    this.link = link;
    this.description = description;
    this.isEnabled = isEnabled ?? true;
  }
}

export { XmbItem as default };
