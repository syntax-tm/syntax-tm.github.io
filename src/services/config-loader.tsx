import { cache } from "react";
import menuConfig from "@config/menu.json";
import { createIcon, XmbItem, XmbMenu } from "types";
import { MenuCategoryConfig, MenuConfig } from "types/config";
import { XmbCategory } from "types/xmb/xmb-category";

if (!menuConfig)
  throw new Error(`Failed to load the menu config.`);

export const config = menuConfig as MenuConfig;

export const buildMenu = cache(() => {

  const categories: XmbCategory[] = [];
  
  const buildMenuItems = (config: MenuConfig, category: MenuCategoryConfig) => {
    let i = 0;
    const items: XmbItem[] = category.items.map((item) => {
      // const iconClassName = item.icon?.className || '';
      const icon = item.icon ? createIcon(item.icon.kind, { ...item.icon.props }) : undefined;
      if (!icon) throw new Error(`Failed to create icon for menu item '${item.title}'.`);
      return new XmbItem(item.type, item.title, icon, item.link, item.description, !item.isDisabled, item.isHidden, i++);

    });

    return items;
  };

  config.categories.forEach((category, index) => {
    // const iconClassName = category.icon.className || '';
    const icon = createIcon(category.icon.kind, { ...category.icon.props });

    // if (category.icon.type === 'fa') {
    //   icon = createFaIcon(category.icon.kind as FaIconKind, { className: iconClassName });
    // }
    // else if (category.icon.type === 'svg') {
    //   icon = createSvgIcon(category.icon.kind, { className: iconClassName });
    // }
    // // else if (category.icon.type === 'image') {
    // //   icon = createBitmapIcon(category.icon.kind, { ...category.icon });
    // // }
    // else if (category.icon.type === 'component') {
    //   icon = createComponentIcon(category.icon.kind, { className: iconClassName });
    // }

    if (!icon) {
      throw new Error(`Failed to create icon for category '${category.title}'.`);
    }

    const items = buildMenuItems(config, category);

    const xmbCategory = new XmbCategory(category.type, index, category.title, icon, items);
    categories.push(xmbCategory);
  });

  const xmbMenu = new XmbMenu(categories);

  return xmbMenu;
});

export { config as default };
