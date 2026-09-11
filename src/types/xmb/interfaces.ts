import { Category, MenuItemType } from "@enums";
import { IconKind, IconType } from "types/icons";
import { IconBase } from "./xmb-icon";

export interface IRefresh {
  refresh: () => void;
}

export interface IXmbIconBase {
  type: IconType;
  kind: unknown;
  props: unknown;

  is: (iconKind: IconKind) => boolean;
}

export interface IXmbIcon<K, P> extends IXmbIconBase {
  kind: K;
  props: P;
}

export interface IMenuItem {
  type: MenuItemType;
  title: string;
  link?: string | null;
  icon: IconBase;
  description?: string | null;
  isEnabled: boolean;
  isHidden: boolean;
  category: ICategory | null;
  index: number;
}

export interface IXmbItem extends IMenuItem {
  category: IXmbCategory | null;
}

export interface ICategory extends IRefresh {
  index: number;
  title: string;
  icon: IconBase;
  itemCount: number;
  items: IMenuItem[];
  type: Category;
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
