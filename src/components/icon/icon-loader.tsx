'use client';

// import dynamic from 'next/dynamic';
// import * as icons from './icons';
import { getProperty } from 'utils';
import * as icons from './icon';
// import type { IconProps } from './icons';
// import dynamic, { DynamicOptions } from 'next/dynamic';

// export type IconModule = typeof import('./icons');
// export type Icon = IconModule[keyof IconModule];

// const icons = dynamic<IconModule>(() => import('./icons'), { ssr: false });

// async function loadIcons() {
//   const Icons = await import('@components/icons/icons');
//   return Icons;
// }

export function getIcon(kind: IconKind, props?: icons.IconProps | string) {
  //const icons = await loadIcons();
  const icon = getProperty(icons, kind);

  if (props) {
    if (typeof props === 'string') {
      return icon({ className: props });
    }
    return icon(props);
  }

  return icon();
};
