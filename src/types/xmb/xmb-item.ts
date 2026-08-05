import { ReactElement } from "react";

export interface IXmbItem {
  id: string;
  title: string;
  link?: string | null;
  type: string;
  icon: ReactElement | null;
  description?: string | null;
  category?: string;
}

export class XmbItem implements IXmbItem {
  id: string;
  title: string;
  link?: string | null = '';
  type: string = '';
  icon: ReactElement | null;
  description?: string | null = '';
  category?: string = '';

  constructor(id: string, title: string = '', icon: ReactElement | null = null, link?: string | null, description?: string | null) {
    this.id = id;
    this.title = title;
    this.icon = icon;
    this.link = link;
    this.description = description;
  }
}