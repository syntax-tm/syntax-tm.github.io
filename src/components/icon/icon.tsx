/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { ReactElement } from "react";
import Image, { ImageProps } from "next/image";
import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { FaIconKind, faIconKinds, faIconMap } from "types/icons/fa-icons";
import resumeIcon from "public/image/xmb/resume.png";
import updateIcon from "public/image/xmb/update.png";
import halo3generalBwIcon from "public/image/halo_3_general_bw.png";
import { EggIcon, PspBattery, Steam, Controller, StatsFm, NextJs, Exophase, TrueAchievements, GithubActions, Chocolatey, Social, User, Photo, Music, Video, EggProps } from './icons/';
import { BitmapIconKind, bitmapIconKinds, ComponentIconKind, IXmbIcon, SvgIconKind } from "types";

const xmbIconClassName = "xmb-icon text-white!";

export interface IconProps extends Exclude<Partial<ImageProps>, 'src' | 'style'> {
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
}

// NOTE: faIconKinds and FaIconKind type are imported from fa-icons.ts

export function createFaIcon(icon: FaIconKind, props?: Partial<FontAwesomeIconProps>): ReactElement {
  const def = faIconMap[icon];
  if (!def) {
    throw new Error(`Unknown icon '${icon}'.`);
  }
  return <FontAwesomeIcon icon={def} {...props} className={`xmb-icon text-white ${props?.className}`} />;
}

export function createSvgIcon(icon: SvgIconKind, props?: Partial<React.SVGProps<SVGSVGElement>>): ReactElement {
  const className = `xmb-icon ${props?.className}`;
  switch (icon) {
    case 'choco': return <Chocolatey {...props} className={className} />;
    case 'controller': return <Controller {...props} className={className} />;
    case 'exophase': return <Exophase {...props} className={className} />;
    case 'github-actions': return <GithubActions {...props} className={className} />;
    case 'music': return <Music {...props} className={className} />;
    case 'next-js': return <NextJs {...props} className={className} />;
    case 'photo': return <Photo {...props} className={className} />;
    case 'psp-battery': return <PspBattery {...props} className={className} />;
    case 'social': return <Social {...props} className={className} />;
    case 'stats-fm': return <StatsFm {...props} className={className} />;
    case 'steam': return <Steam {...props} className={className} />;
    case 'true-achievements': return <TrueAchievements {...props} className={className} />;
    case 'user': return <User {...props} className={className} />;
    case 'video': return <Video {...props} className={className} />;
  }
}

export function createComponentIcon(icon: ComponentIconKind, props?: IconProps): ReactElement {
  switch (icon) {
    case 'egg': return <EggIcon width={props?.width ?? 120} height={props?.height ?? 120} className={props?.className ?? 'xmb-icon'} />;
  }
}

export function createBitmapIcon(icon: BitmapIconKind, props?: ImageProps): ReactElement {
  let src: string;
  switch (icon) {
    case 'h3-general': src = 'images/halo_3_general_bw.png'; break;
    case 'ps1': src = 'images/ps1.png'; break;
    case 'resume': src = 'images/resume.png'; break;
    case 'update': src = 'images/xmb/update.png'; break;
    case 'custom': src = ''; break;
  }

  return <Image src={src} width={120} height={120} alt={props?.alt ?? ''} {...props} />;
}

export function createBitmapSrcIcon(src: string, props?: ImageProps): ReactElement {
  const icon = <Image src={src} width={120} height={120} alt={''} />;
  return icon;
}

type faIcon = [kind: FaIconKind, props: FontAwesomeIconProps];
type bmpIcon = [kind: BitmapIconKind, props: ImageProps];
type svgIcon = [kind: SvgIconKind, props: React.SVGProps<SVGSVGElement>];

export const getIcon = (def: faIcon | bmpIcon | svgIcon) => {
  const kind = def[0];
  const props = def[1];
  if (kind as FaIconKind) {
    return createFaIcon(kind as FaIconKind, props as FontAwesomeIconProps);
  }
  if (bitmapIconKinds.includes(kind as BitmapIconKind)) {
    return createBitmapIcon(kind as BitmapIconKind, props as ImageProps);
  }
  if (kind as SvgIconKind) {
    return createSvgIcon(kind as SvgIconKind, props as React.SVGProps<SVGSVGElement>);
  }
};

export function resume(props?: IconProps) {
  return <Image src={resumeIcon} {...props} className={`xmb-icon ${props?.className}`}
    alt="resume icon" />;
}
export function update(props?: IconProps) {
  return <Image src={updateIcon} {...props} className={`xmb-icon ${props?.className}`}
    alt="update icon" />;
}
export function h3general(props?: IconProps) {
  return <Image src={halo3generalBwIcon} {...props} className={`xmb-icon ${props?.className}`}
    alt="h3 general icon" />;
}
