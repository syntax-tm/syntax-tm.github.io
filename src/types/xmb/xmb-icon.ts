import { BitmapIconKind, bitmapIconKinds, ComponentIconKind, componentIconKinds, FaIconKind, faIconKinds, IconKind, IconType, SvgIconKind, svgIconKinds } from "types/icons";
import { IXmbIcon, IXmbIconBase } from "./interfaces";
import { ReactElement } from "react";
import { ImageProps } from "next/image";
import { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { IconProps } from "@components/icon";
import * as icons from '@components/icon';

export type IconPropType =  React.SVGProps<SVGSVGElement> | ImageProps | FontAwesomeIconProps | IconProps;

export interface ISvgIcon extends IXmbIcon<SvgIconKind, React.SVGProps<SVGSVGElement>> {
  kind: SvgIconKind;
  props: React.SVGProps<SVGSVGElement>;
}

export interface IBitmapIcon extends IXmbIcon<BitmapIconKind, ImageProps> {
  kind: BitmapIconKind;
  props: ImageProps;
}

export interface IFaIcon extends IXmbIcon<FaIconKind, Partial<FontAwesomeIconProps>> {
  kind: FaIconKind;
  props: Partial<FontAwesomeIconProps>;
}

export interface IComponentIcon extends IXmbIcon<ComponentIconKind, IconProps> {
  kind: ComponentIconKind;
  props: IconProps;
}

function isSvgIcon(kind: IconKind): kind is SvgIconKind {
  return svgIconKinds.includes(kind as SvgIconKind);
}

function isFaIcon(kind: IconKind): kind is FaIconKind {
  return faIconKinds.includes(kind as FaIconKind);
}

function isBitmapIcon(kind: IconKind): kind is BitmapIconKind {
  return bitmapIconKinds.includes(kind as BitmapIconKind);
}

function isComponentIcon(kind: IconKind): kind is ComponentIconKind {
  return componentIconKinds.includes(kind as ComponentIconKind);
}

export const createSvgIcon = (kind: SvgIconKind, props: React.SVGProps<SVGSVGElement>): SvgIcon => {
  const icon = new SvgIcon(kind, props);
  return icon;
};

export const createFaIcon = (kind: FaIconKind, props: Partial<FontAwesomeIconProps>): FaIcon => {
  const icon = new FaIcon(kind, props);
  return icon;
};

export const createBitmapIcon = (kind: BitmapIconKind, props: ImageProps): BitmapIcon => {
  const icon = new BitmapIcon(kind, props);
  return icon;
};

export const createComponentIcon = (kind: ComponentIconKind, props: IconProps): ComponentIcon => {
  const icon = new ComponentIcon(kind, props);
  return icon;
};

export const createIcon = (kind: IconKind, props: IconPropType): IconBase => {
  if (isFaIcon(kind)) {
    return createFaIcon(kind, props as FontAwesomeIconProps);
  }
  if (isSvgIcon(kind)) {
    return createSvgIcon(kind, props as React.SVGProps<SVGSVGElement>);
  }
  if (isBitmapIcon(kind)) {
    return createBitmapIcon(kind, props as ImageProps);
  }
  if (isComponentIcon(kind)) {
    return createComponentIcon(kind, props as IconProps);
  }
  throw new Error(`Unkown IconKind.`);
};

export abstract class IconBase implements IXmbIconBase
{
  protected _element: ReactElement | undefined;

  constructor (public type: IconType, public kind: unknown, public props: unknown) { }

  is(iconKind: IconKind) {
    return this.kind === iconKind;
  }

  get element(): ReactElement | undefined {
    if (!this._element) {
      this._element = this.loadElement();
    }
    return this._element;
  }

  set element(value: ReactElement) {
    this._element = value;
  }

  abstract loadElement(): ReactElement;
}

export class SvgIcon extends IconBase implements ISvgIcon
{
  type: IconType;
  kind: SvgIconKind;
  props: Partial<React.SVGProps<SVGSVGElement>>;

  constructor(kind: SvgIconKind, props: Partial<React.SVGProps<SVGSVGElement>>) {
    super('image', kind, props);

    this.type = 'svg';
    this.kind = kind;
    this.props = props;
  }

  loadElement(): ReactElement {
    return icons.createSvgIcon(this.kind, this.props);
  }
}

export class FaIcon extends IconBase implements IFaIcon
{
  type: IconType;
  kind: FaIconKind;
  props: Partial<FontAwesomeIconProps>;

  constructor(kind: FaIconKind, props: Partial<FontAwesomeIconProps>) {
    super('image', kind, props);

    this.type = 'fa';
    this.kind = kind;
    this.props = props;
  }

  loadElement(): ReactElement {
    return icons.createFaIcon(this.kind, this.props);
  }
}

export class BitmapIcon extends IconBase implements IBitmapIcon
{
  type: IconType;
  kind: BitmapIconKind;
  props: ImageProps;
  src?: string;

  constructor(kind: BitmapIconKind, props: ImageProps, src?: string) {
    super('image', kind, props);

    this.type = 'image';
    this.kind = kind;
    this.props = props;
    this.src = src;
  }

  loadElement(): ReactElement {
    return icons.createBitmapIcon(this.kind, this.props);
  }
}

export class ComponentIcon extends IconBase implements IComponentIcon
{
  type: IconType;
  kind: ComponentIconKind;
  props: IconProps;

  constructor(kind: ComponentIconKind, props: IconProps) {
    super('image', kind, props);

    this.type = 'component';
    this.kind = kind;
    this.props = props;
  }

  loadElement(): ReactElement {
    return icons.createComponentIcon(this.kind, this.props);
  }
}

// export class XmbIcon
// {
//   private _element: ReactElement | null = null;
//   private _def: IXmbIconBase | null = null;

//   constructor(def: IXmbIconBase) {
//     this._def = def;
//   }

//   create(def: SvgIcon): XmbIcon;
//   create(def: FaIcon): XmbIcon;

//   create({type, kind, props}: SvgIcon) {
//     const obj = new XmbIcon({ type, kind, props });
//     return obj;
//   }

//   create({type, kind, props}: FaIcon) {
//     const obj = new XmbIcon({ type, kind, props });
//     return obj;
//   }

//   get element(): ReactElement | null {
//     return this._element;
//   }

//   set element(value: ReactElement | null) {
//     this._element = value;
//   }
// }
