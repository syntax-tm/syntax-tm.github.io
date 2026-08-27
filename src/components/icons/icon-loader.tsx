'use client';

import * as icons from './icons';
import { getProperty } from 'utils';

export type FaIconKind = 'egg' |'info' |'infoCircle' |'question' |'questionCircle' |'share' |'fontAwesome' |'codeFork' |'boxes' |'chart' |'star' |'code' |'cog' |'trophy' |'award' |'message' |'c' |'medal' |'computer' |'computerMouse' |'keyboard' |'headset' |'laptop' |'desktop' |'disease' |'copy' |'github' |'githubAlt' |'gitlab' |'stackOverflow' |'youtube' |'spotify' |'facebook' |'discord' |'xbox' |'playstation' |'steam' |'amazon' |'battleNet' |'docker' |'git' |'xTwitter' |'snapchat' |'instagram' |'twitch' |'threads' |'telegram';
export type SvgIconKind = 'controller' | 'trueachievements' | 'exophase' |'statsFm' | 'nextJs' | 'githubActions';
export type BitmapIconKind = 'home' |'display' |'music' |'photo' |'prime' |'resume' |'settings' |'update' |'user' |'video' |'h3general' | 'choco' | 'PspBattery';
export type IconKind = FaIconKind | BitmapIconKind | SvgIconKind;

export const getIcon = (kind: IconKind, props?: icons.IconProps | string) => {
  const icon = getProperty(icons, kind);

  if (props) {
    if (typeof props === 'string') {
      return icon({ className: props });
    }
    return icon(props);
  }

  return icon();
};
