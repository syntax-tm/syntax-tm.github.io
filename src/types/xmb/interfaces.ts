import { ReactElement } from "react";

export interface IMenuItem {
  id: string;
  title: string;
  link?: string | null;
  type: string;
  icon: ReactElement | null;
  description?: string | null;
  category?: string;
}

export interface IXmbItem extends IMenuItem {
  isEnabled: boolean;
}

export interface ICategory {
  index: number;
  title: string;
  icon: ReactElement;
  items: IXmbItem[];
  itemCount: number;
}

export interface IXmbCategory extends ICategory {
  items: IXmbItem[];
}

export interface IMenu {
  [index: number]: ICategory;

  items: ICategory[];
}

export interface IXmbMenu extends IMenu {
  [index: number]: IXmbCategory;

  items: IXmbCategory[];
}
