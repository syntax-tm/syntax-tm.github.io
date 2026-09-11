import { AchievementId, Category, MenuItemType } from "@enums";
import { BitmapIconKind, ComponentIconKind, FaIconKind, IconKind, IconType, SvgIconKind } from "./icons";
import { IconPropType } from "./xmb";



export interface IconThemeConfig {
  id?: string,
  type?: IconType,
  kind?: IconKind,
  className?: string,
  width?: number,
  height?: number,
}

export interface IconConfigBase<T> {
  type: IconType,
  kind: T,
  className?: string,
  width?: number,
  height?: number,
  props?: IconPropType,
  themes?: Record<AchievementId, IconThemeConfig>,
}

export interface FaIconConfig extends IconConfigBase<FaIconKind> {
  type: 'fa',
}

export interface SvgIconConfig extends IconConfigBase<SvgIconKind> {
  type: 'svg',
}

export interface BitmapIconConfig extends IconConfigBase<BitmapIconKind> {
  type: 'image',
}

export interface ComponentIconConfig extends IconConfigBase<ComponentIconKind> {
  type: 'component',
}

export type IconConfig = FaIconConfig | SvgIconConfig | BitmapIconConfig | ComponentIconConfig;

export interface MenuItemConfig {
  type: MenuItemType,
  title: string,
  description?: string,
  link?: string,
  isDisabled?: boolean,
  isHidden?: boolean,
  icon?: IconConfig,
}

export interface MenuCategoryConfig {
  type: Category,
  title: string,
  description?: string,
  icon: IconConfig,
  items: MenuItemConfig[],
}

export interface MenuConfig {
  defaultTheme?: IconPropType,
  categories: MenuCategoryConfig[],
}
