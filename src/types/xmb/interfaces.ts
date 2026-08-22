import { ReactElement } from "react";
import XmbCategory from "./xmb-category";

export interface IMenuItem {
  id: string;
  title: string;
  link?: string | null;
  type: string;
  icon: ReactElement | null;
  description?: string | null;
  isEnabled: boolean;
  isHidden: boolean;
  category: ICategory | null;
}

export interface IXmbItem extends IMenuItem {
  category: IXmbCategory | null;
}

export interface ICategory {
  index: number;
  title: string;
  icon: ReactElement;
  itemCount: number;
  items: IMenuItem[];
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
