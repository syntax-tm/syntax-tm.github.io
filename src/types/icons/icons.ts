import { FaIconKind } from "./fa-icons";

export const componentIconKinds = ['egg'] as const;
export type ComponentIconKind = typeof componentIconKinds[number];

export const svgIconKinds = ['psp-battery', 'controller' , 'true-achievements' , 'exophase' ,'stats-fm' , 'next-js' , 'github-actions', 'steam', 'choco', 'social', 'user', 'video', 'photo', 'music'] as const;
export type SvgIconKind = typeof svgIconKinds[number];

export const bitmapIconKinds = ['resume', 'ps1', 'update', 'h3-general', 'custom'] as const;
export type BitmapIconKind = typeof bitmapIconKinds[number];

/**
 * Identifies every known icon used by the application.
 * @see {@link FaIconKind}
 * @see {@link BitmapIconKind}
 * @see {@link SvgIconKind}
 * @see {@link ComponentIconKind}
 */
export type IconKind = FaIconKind | BitmapIconKind | SvgIconKind | ComponentIconKind;

export type IconType = 'fa' | 'svg' | 'image' | 'component';
